import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Model } from 'mongoose';
import { PatchNote } from '../schemas/patch-note.schema';
import { PatchChange } from '../schemas/patch-change.schema';
import { PatchNoteStatus, PatchNoteType } from '../entities/patch-note.entity';
import { PatchNoteParserService } from './patch-note-parser.service';

@Injectable()
export class PatchNoteImporterService {
  constructor(
    @InjectModel(PatchNote.name)
    private patchNoteModel: Model<PatchNote>,
    @InjectModel(PatchChange.name)
    private patchChangeModel: Model<PatchChange>,
    private patchNoteParserService: PatchNoteParserService,
  ) {}

  async importFromUrl(url: string, userId: string): Promise<PatchNote> {
    const sourceNewsId = this.extractNewsId(url);
    if (sourceNewsId) {
      const existing = await this.patchNoteModel.findOne({
        source_newsid: sourceNewsId,
        deleted_at: null,
      });
      if (existing) {
        throw new ConflictException('Patch note source already imported');
      }
    }

    const response = await axios.get(url, {
      responseType: 'text',
      timeout: 15000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; MLBBPatchImporter/1.0; +https://www.mobilelegends.com)',
      },
    });

    const html = response.data as string;
    const content = this.extractReadableContent(html);
    const title = this.extractTitle(html, content);
    const publishedAt = this.extractPublishedAt(content) ?? new Date();

    const patchNote = await this.patchNoteModel.create({
      name: title,
      version: this.extractVersion(title) ?? this.extractVersion(content),
      start_date: publishedAt,
      end_date: publishedAt,
      published_at: publishedAt,
      type: this.extractPatchType(title, content),
      season: 0,
      is_active: false,
      status: PatchNoteStatus.DRAFT,
      source_url: url,
      source_newsid: sourceNewsId,
      summary: this.extractSummary(content),
      raw_content: content,
      imported_at: new Date(),
      created_by: userId,
    });

    const changes = await this.patchNoteParserService.parse(content);
    if (changes.length) {
      await this.patchChangeModel.create(
        changes.map((change) => ({
          ...change,
          patch_note: (patchNote as any)._id,
        })),
      );
    }

    return patchNote;
  }

  private extractNewsId(url: string): string | undefined {
    try {
      return new URL(url).searchParams.get('newsid') ?? undefined;
    } catch {
      return undefined;
    }
  }

  private extractReadableContent(html: string): string {
    const $ = cheerio.load(html);
    $('script, style, noscript').remove();

    return $('body')
      .text()
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join('\n');
  }

  private extractTitle(html: string, content: string): string {
    const $ = cheerio.load(html);
    const heading = $('h1').first().text().trim();
    if (heading) return heading;

    const title = $('title').first().text().trim();
    if (title) return title.replace('Mobile Legends: Bang Bang - ', '').trim();

    return content.split('\n').find(Boolean) ?? 'Imported Patch Note';
  }

  private extractPublishedAt(content: string): Date | undefined {
    const match = content.match(/\b(20\d{2}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\b/);
    if (!match) return undefined;

    const parsed = new Date(match[1].replace(' ', 'T'));
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }

  private extractVersion(value: string): string | undefined {
    return value.match(/\b\d+\.\d+\.\d+\b/)?.[0];
  }

  private extractPatchType(title: string, content: string): PatchNoteType {
    const value = `${title}\n${content}`.toLowerCase();
    if (value.includes('hotfix')) return PatchNoteType.HOTFIX;
    if (value.includes('major')) return PatchNoteType.MAJOR;
    if (value.includes('minor')) return PatchNoteType.MINOR;
    return PatchNoteType.PATCH;
  }

  private extractSummary(content: string): string | undefined {
    return content
      .split('\n')
      .find((line) => line.length > 80 && !line.includes('>>'))
      ?.slice(0, 500);
  }
}
