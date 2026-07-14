import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hero } from 'src/hero/schemas/hero.schema';
import { Item } from 'src/item/schemas/item.schema';
import {
  CreatePatchChangeInput,
  PatchChangeDetailInput,
} from '../dto/create-patch-change.input';
import {
  PatchChangeType,
  PatchTargetType,
} from '../entities/patch-change.entity';

@Injectable()
export class PatchNoteParserService {
  constructor(
    @InjectModel(Hero.name)
    private heroModel: Model<Hero>,
    @InjectModel(Item.name)
    private itemModel: Model<Item>,
  ) {}

  async parse(rawContent: string): Promise<CreatePatchChangeInput[]> {
    const lines = this.normalizeContent(rawContent)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const changes: CreatePatchChangeInput[] = [];

    let currentTarget: ParsedTarget | undefined;
    let currentDomainType: PatchTargetType | undefined;
    let currentSection = 'General';
    let currentChangeType = PatchChangeType.ADJUSTED;
    let buffer: string[] = [];
    let order = 0;

    const flush = async () => {
      if (!currentTarget || !buffer.length) return;

      const rawText = buffer.join('\n');
      const description = this.buildDescription(buffer);
      const details = this.extractDetails(buffer);
      if (!description && !details.length) {
        buffer = [];
        return;
      }

      const resolvedTarget = await this.resolveTarget(currentTarget);
      changes.push({
        target_type: resolvedTarget.type,
        target_ref: resolvedTarget.ref,
        target_name: currentTarget.name,
        change_type: currentChangeType,
        section: currentSection,
        title: currentSection,
        description,
        details,
        raw_text: rawText,
        order: order++,
      });
      buffer = [];
    };

    for (const line of lines) {
      const domainTarget = this.parseDomainHeading(line);
      if (domainTarget) {
        await flush();
        currentTarget = domainTarget;
        currentDomainType = domainTarget.type;
        currentSection = 'General';
        currentChangeType = domainTarget.changeType;
        continue;
      }

      const domainContext = this.parseDomainContext(line);
      if (domainContext) {
        await flush();
        currentDomainType = domainContext;
        currentTarget = domainContext === PatchTargetType.BATTLEFIELD
          ? {
              name: 'Battlefield',
              type: PatchTargetType.BATTLEFIELD,
              changeType: PatchChangeType.ADJUSTED,
            }
          : undefined;
        currentSection = 'General';
        currentChangeType = PatchChangeType.ADJUSTED;
        continue;
      }

      const target = this.parseTargetHeader(line);
      if (target) {
        await flush();
        currentTarget = {
          ...target,
          fallbackType: currentDomainType,
        };
        currentSection = 'General';
        currentChangeType = target.changeType;
        continue;
      }

      const section = this.parseSectionHeader(line);
      if (section && currentTarget) {
        await flush();
        currentSection = section.name;
        currentChangeType = section.changeType ?? currentTarget.changeType;
        continue;
      }

      if (currentTarget) {
        buffer.push(line);
      }
    }

    await flush();
    return changes;
  }

  private normalizeContent(rawContent: string): string {
    return rawContent
      .replace(/\r\n?/g, '\n')
      .replace(/\s*(\[[^\]]+\]\s*\([↑↓~]\))\s*/g, '\n$1\n')
      .trim();
  }

  private parseTargetHeader(line: string): ParsedTarget | undefined {
    const match = line.match(/^\[([^\]]+)\]\s*(?:\(([^)]+)\))?$/);
    if (!match) return undefined;

    const name = match[1].trim();
    const marker = match[2]?.trim();
    if (this.isSectionName(name)) return undefined;

    return {
      name,
      type: this.guessTargetType(name),
      changeType: this.mapChangeType(marker),
    };
  }

  private parseDomainHeading(line: string): ParsedTarget | undefined {
    const normalized = line.replace(/^\d+\.\s*/, '').trim();
    const definitions: Array<{
      pattern: RegExp;
      name: string;
      type: PatchTargetType;
    }> = [
      {
        pattern: /^(?:battlefield adjustments?|penyesuaian (?:battlefield|medan tempur))$/i,
        name: 'Battlefield',
        type: PatchTargetType.BATTLEFIELD,
      },
      {
        pattern: /^(?:system adjustments?|penyesuaian sistem)$/i,
        name: 'System',
        type: PatchTargetType.SYSTEM,
      },
      {
        pattern: /^(?:(?:game\s+)?mode adjustments?|penyesuaian mode)$/i,
        name: 'Game Mode',
        type: PatchTargetType.GAME_MODE,
      },
    ];
    const definition = definitions.find(({ pattern }) => pattern.test(normalized));
    if (!definition) return undefined;

    return {
      name: definition.name,
      type: definition.type,
      changeType: PatchChangeType.ADJUSTED,
    };
  }

  private parseDomainContext(line: string): PatchTargetType | undefined {
    const normalized = line.replace(/^\d+\.\s*/, '').trim();
    if (/^(?:hero adjustments?|penyesuaian hero)$/i.test(normalized)) {
      return PatchTargetType.HERO;
    }
    if (/^(?:equipment adjustments?|penyesuaian equipment|penyesuaian item)\b/i.test(normalized)) {
      return PatchTargetType.ITEM;
    }
    if (/^(?:jungle adjustments?|penyesuaian jungle)\b/i.test(normalized)) {
      return PatchTargetType.BATTLEFIELD;
    }

    return undefined;
  }

  private parseSectionHeader(line: string): ParsedSection | undefined {
    const match = line.match(/^\[([^\]]+)\]\s*(?:\(([^)]+)\))?$/);
    if (!match) return undefined;

    const name = match[1].trim();
    if (!this.isSectionName(name)) return undefined;

    return {
      name,
      changeType: match[2] ? this.mapChangeType(match[2].trim()) : undefined,
    };
  }

  private isSectionName(name: string): boolean {
    return /^(attributes|atribut|passive|pasif|skill\s*\d+|ultimate|equipment|item|system|sistem|battlefield|game mode|mode)/i.test(
      name,
    );
  }

  private guessTargetType(name: string): PatchTargetType {
    if (/^(battlefield|system|game mode)$/i.test(name)) {
      return name.toLowerCase().replace(' ', '_') as PatchTargetType;
    }
    return PatchTargetType.HERO;
  }

  private mapChangeType(marker?: string): PatchChangeType {
    if (!marker) return PatchChangeType.ADJUSTED;
    if (marker.includes('↑')) return PatchChangeType.BUFF;
    if (marker.includes('↓')) return PatchChangeType.NERF;
    if (marker.includes('~')) return PatchChangeType.ADJUSTED;
    return PatchChangeType.ADJUSTED;
  }

  private buildDescription(lines: string[]): string {
    return (
      lines.find(
        (line) =>
          !line.includes('>>') &&
          line.length > 20 &&
          this.hasMeaningfulContent(line),
      ) ??
      lines.find((line) => this.hasMeaningfulContent(line)) ??
      ''
    );
  }

  private hasMeaningfulContent(value: string): boolean {
    const words = value.toLowerCase().match(/[a-z0-9]+(?:['-][a-z0-9]+)*/g) ?? [];
    const connectorWords = new Set(['and', 'or', 'but']);
    return words.some((word) => !connectorWords.has(word));
  }

  private extractDetails(lines: string[]): PatchChangeDetailInput[] {
    return lines
      .map((line): PatchChangeDetailInput | undefined => {
        const match = line.match(/^([^:]+):\s*(.+?)\s*>>\s*(.+)$/);
        if (!match) return undefined;

        return {
          field: match[1].trim(),
          old_value: match[2].trim(),
          new_value: match[3].trim(),
          raw_text: line,
        };
      })
      .filter((detail): detail is PatchChangeDetailInput => Boolean(detail));
  }

  private async resolveTarget(target: ParsedTarget): Promise<ResolvedTarget> {
    if (target.type !== PatchTargetType.HERO) {
      return { type: target.type };
    }

    const nameFilter = {
      name: new RegExp(`^${this.escapeRegex(target.name)}$`, 'i'),
    };
    const hero = await this.heroModel.findOne(nameFilter).select('_id').lean();
    if (hero?._id) {
      return { type: PatchTargetType.HERO, ref: hero._id.toString() };
    }

    const item = await this.itemModel.findOne(nameFilter).select('_id').lean();
    if (item?._id) {
      return { type: PatchTargetType.ITEM, ref: item._id.toString() };
    }

    return { type: target.fallbackType ?? PatchTargetType.HERO };
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

type ParsedTarget = {
  name: string;
  type: PatchTargetType;
  changeType: PatchChangeType;
  fallbackType?: PatchTargetType;
};

type ParsedSection = {
  name: string;
  changeType?: PatchChangeType;
};

type ResolvedTarget = {
  type: PatchTargetType;
  ref?: string;
};
