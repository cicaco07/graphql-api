import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tournament, TournamentDocument } from '../schemas/tournament.schema';
import {
  TournamentStage,
  TournamentStageDocument,
} from '../schemas/tournament-stage.schema';
import { HeroStats, HeroStatsDocument } from '../schemas/hero-stats.schema';
import { SyncLog, SyncLogDocument } from '../schemas/sync-log.schema';
import { ScraperService } from './scraper.service';
import { SyncStatus } from '../enum/sync-status.enum';

export interface SyncResult {
  success: boolean;
  message: string;
  itemsSynced: number;
  syncedAt: Date;
  errors: string[];
}

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    @InjectModel(Tournament.name)
    private tournamentModel: Model<TournamentDocument>,
    @InjectModel(TournamentStage.name)
    private stageModel: Model<TournamentStageDocument>,
    @InjectModel(HeroStats.name)
    private heroStatsModel: Model<HeroStatsDocument>,
    @InjectModel(SyncLog.name) private syncLogModel: Model<SyncLogDocument>,
    private readonly scraperService: ScraperService,
  ) {}

  // ─── Sync penuh satu tournament (semua stages) ──────────────────────────
  async syncTournament(tournamentId: string): Promise<SyncResult> {
    const tournament = await this.tournamentModel.findById(tournamentId);
    if (!tournament) throw new NotFoundException('Tournament not found');

    // Tandai status syncing
    await this.tournamentModel.updateOne(
      { _id: tournamentId },
      { syncStatus: SyncStatus.SYNCING, syncError: null },
    );

    const log = await this.syncLogModel.create({
      tournamentId: new Types.ObjectId(tournamentId),
      type: 'full',
      status: 'started',
      startedAt: new Date(),
      triggeredBy: 'user',
    });

    const errors: string[] = [];
    let totalSynced = 0;

    try {
      // 1. Scrape & upsert stages
      const scrapedStages = await this.scraperService.scrapeStages(
        tournament.liquipediaSlug,
      );
      const savedStages = await this.upsertStages(tournamentId, scrapedStages);

      // 2. Sync hero stats per stage
      for (const stage of savedStages) {
        try {
          const count = await this.syncHeroStatsForStage(tournamentId, stage);
          totalSynced += count;
        } catch (err: any) {
          this.logger.error(`Stage sync error [${stage.name}]: ${err.message}`);
          errors.push(`Stage "${stage.name}": ${err.message}`);
        }
      }

      // 3. Update tournament
      const now = new Date();
      await this.tournamentModel.updateOne(
        { _id: tournamentId },
        {
          syncStatus: errors.length ? SyncStatus.FAILED : SyncStatus.SUCCESS,
          lastSyncedAt: now,
          syncError: errors.length ? errors.join(' | ') : null,
        },
      );

      await this.syncLogModel.updateOne(
        { _id: log._id },
        {
          status: errors.length ? 'failed' : 'success',
          itemsSynced: totalSynced,
          finishedAt: now,
        },
      );

      return {
        success: errors.length === 0,
        message: errors.length
          ? `Sync completed with ${errors.length} error(s)`
          : `Sync successful: ${totalSynced} hero stats updated`,
        itemsSynced: totalSynced,
        syncedAt: now,
        errors,
      };
    } catch (err: any) {
      const errMsg = err.message;
      await this.tournamentModel.updateOne(
        { _id: tournamentId },
        { syncStatus: SyncStatus.FAILED, syncError: errMsg },
      );
      await this.syncLogModel.updateOne(
        { _id: log._id },
        { status: 'failed', errorMessage: errMsg, finishedAt: new Date() },
      );
      return {
        success: false,
        message: errMsg,
        itemsSynced: 0,
        syncedAt: new Date(),
        errors: [errMsg],
      };
    }
  }

  // ─── Sync satu stage saja ────────────────────────────────────────────────
  async syncStage(tournamentId: string, stageId: string): Promise<SyncResult> {
    const stage = await this.stageModel.findById(stageId);
    if (!stage) throw new NotFoundException('Stage not found');

    const log = await this.syncLogModel.create({
      tournamentId: new Types.ObjectId(tournamentId),
      stageId: new Types.ObjectId(stageId),
      type: 'stage',
      status: 'started',
      startedAt: new Date(),
      triggeredBy: 'user',
    });

    try {
      const count = await this.syncHeroStatsForStage(tournamentId, stage);
      const now = new Date();
      await this.syncLogModel.updateOne(
        { _id: log._id },
        { status: 'success', itemsSynced: count, finishedAt: now },
      );
      return {
        success: true,
        message: `${count} hero stats synced`,
        itemsSynced: count,
        syncedAt: now,
        errors: [],
      };
    } catch (err: any) {
      await this.syncLogModel.updateOne(
        { _id: log._id },
        { status: 'failed', errorMessage: err.message, finishedAt: new Date() },
      );
      return {
        success: false,
        message: err.message,
        itemsSynced: 0,
        syncedAt: new Date(),
        errors: [err.message],
      };
    }
  }

  // ─── Internal: Upsert stages ke database ─────────────────────────────────
  private async upsertStages(tournamentId: string, stages: any[]) {
    const saved: TournamentStageDocument[] = [];
    for (const s of stages) {
      const stage = await this.stageModel.findOneAndUpdate(
        { tournamentId: new Types.ObjectId(tournamentId), slug: s.slug },
        { ...s, tournamentId: new Types.ObjectId(tournamentId) },
        { upsert: true, new: true },
      );
      saved.push(stage);
    }
    return saved;
  }

  // ─── Internal: Sync hero stats untuk satu stage ──────────────────────────
  private async syncHeroStatsForStage(
    tournamentId: string,
    stage: TournamentStageDocument,
  ): Promise<number> {
    const scraped = await this.scraperService.scrapeHeroStats(
      stage.liquipediaUrl,
    );
    if (!scraped.length) return 0;

    const totalGames = scraped.reduce((s, h) => s + h.picks, 0) / 5; // 5 heroes per team
    const now = new Date();
    let count = 0;

    for (const h of scraped) {
      const pickRate = totalGames > 0 ? (h.picks / (totalGames * 2)) * 100 : 0;
      const banRate = totalGames > 0 ? (h.bans / (totalGames * 2)) * 100 : 0;
      const presenceRate =
        totalGames > 0 ? (h.picksAndBans / (totalGames * 2)) * 100 : 0;

      await this.heroStatsModel.findOneAndUpdate(
        {
          tournamentId: new Types.ObjectId(tournamentId),
          stageId: stage._id,
          heroSlug: h.heroSlug,
        },
        {
          ...h,
          pickRate: Math.min(pickRate, 100),
          banRate: Math.min(banRate, 100),
          presenceRate: Math.min(presenceRate, 100),
          tournamentId: new Types.ObjectId(tournamentId),
          stageId: stage._id,
          syncedAt: now,
        },
        { upsert: true, new: true },
      );
      count++;
    }
    return count;
  }
}
