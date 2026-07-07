import { BadGatewayException, ConflictException, Injectable } from '@nestjs/common';
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
  private readonly gmsSourceUrl =
    'https://api.gms.moontontech.com/api/gms/source/2669606/2672947';

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

    const article = await this.fetchOfficialArticle(sourceNewsId);
    const content = this.extractReadableContent(article.body);
    const title = article.title;
    const publishedAt = article.publishedAt ?? new Date();

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

  private async fetchOfficialArticle(newsId?: string): Promise<OfficialArticle> {
    if (!newsId) {
      throw new BadGatewayException('Mobile Legends newsid is missing');
    }

    const response = await axios.post(
      this.gmsSourceUrl,
      {},
      {
        timeout: 15000,
        headers: {
          Origin: 'https://www.mobilelegends.com',
          Referer: 'https://www.mobilelegends.com/',
          'User-Agent':
            'Mozilla/5.0 (compatible; MLBBPatchImporter/1.0; +https://www.mobilelegends.com)',
        },
      },
    );

    const records = response.data?.data?.records ?? [];
    const record = records.find(
      (item: { id?: number | string }) => String(item.id) === String(newsId),
    );
    if (!record?.data?.body) {
      throw new BadGatewayException('Mobile Legends article body not found');
    }

    return {
      body: record.data.body,
      title: record.data.title ?? record.data.brief ?? record.caption,
      publishedAt: record.data.start_time
        ? new Date(record.data.start_time)
        : undefined,
    };
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

type OfficialArticle = {
  body: string;
  title: string;
  publishedAt?: Date;
};
