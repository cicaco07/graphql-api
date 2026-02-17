import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tournament, TournamentDocument } from '../schemas/tournament.schema';
import { TournamentStage, TournamentStageDocument } from '../schemas/tournament-stage.schema';
import { HeroStats, HeroStatsDocument } from '../schemas/hero-stats.schema';
import { SyncLog, SyncLogDocument } from '../schemas/sync-log.schema';
import { CreateTournamentInput } from '../dto/create-tournament.input';

@Injectable()
export class TournamentService {
  constructor(
    @InjectModel(Tournament.name)       private tournamentModel: Model<TournamentDocument>,
    @InjectModel(TournamentStage.name)  private stageModel:      Model<TournamentStageDocument>,
    @InjectModel(HeroStats.name)        private heroStatsModel:  Model<HeroStatsDocument>,
    @InjectModel(SyncLog.name)          private syncLogModel:    Model<SyncLogDocument>,
  ) {}

  async create(input: CreateTournamentInput) {
    return this.tournamentModel.create(input);
  }

  async findAll(filters: { tier?: string; status?: string }) {
    const q: any = {};
    if (filters.tier)   q.tier   = filters.tier;
    if (filters.status) q.status = filters.status;
    return this.tournamentModel.find(q).sort({ tierLevel: 1, startDate: -1 }).exec();
  }

  async findOne(id: string) {
    const t = await this.tournamentModel.findById(id).exec();
    if (!t) throw new NotFoundException(`Tournament ${id} not found`);
    return t;
  }

  async getStages(tournamentId: string) {
    return this.stageModel
      .find({ tournamentId: new Types.ObjectId(tournamentId) })
      .sort({ order: 1 })
      .exec();
  }

  async getHeroStats(
    tournamentId: string,
    stageId?: string,
    sortBy = 'picksAndBans',
    limit = 50,
  ) {
    const q: any = { tournamentId: new Types.ObjectId(tournamentId) };
    q.stageId = stageId ? new Types.ObjectId(stageId) : null;

    const allowedSort = ['picksAndBans', 'picks', 'bans', 'winRate', 'presenceRate', 'banRate'];
    const sort = allowedSort.includes(sortBy) ? sortBy : 'picksAndBans';

    return this.heroStatsModel
      .find(q)
      .sort({ [sort]: -1 })
      .limit(Math.min(limit, 200))
      .exec();
  }

  async getSyncLogs(tournamentId: string, limit = 10) {
    return this.syncLogModel
      .find({ tournamentId: new Types.ObjectId(tournamentId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const session = await this.tournamentModel.db.startSession();
    session.startTransaction();
    try {
      const tid = new Types.ObjectId(id);
      await this.heroStatsModel.deleteMany({ tournamentId: tid }, { session });
      await this.stageModel.deleteMany({ tournamentId: tid }, { session });
      await this.syncLogModel.deleteMany({ tournamentId: tid }, { session });
      await this.tournamentModel.findByIdAndDelete(id, { session });
      await session.commitTransaction();
      return true;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }
}