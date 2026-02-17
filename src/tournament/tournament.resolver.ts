import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TournamentService } from './services/tournament.service';
import { SyncService } from './services/sync.service';
import {
  TournamentType,
  TournamentStageType,
  HeroStatsType,
  SyncResultType,
  SyncLogType,
} from './types/tournament.type';
import { CreateTournamentInput } from './dto/create-tournament.input';
import { UpdateTournamentInput } from './dto/update-tournament.input';
import { TournamentTier } from './enum/tournament-tier.enum';
import { TournamentStatus } from './enum/tournament-status.enum';

@Resolver()
export class TournamentResolver {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly syncService: SyncService,
  ) { }

  // ─── Queries ─────────────────────────────────────────────────────────────

  @Query(() => [TournamentType], { name: 'tournaments' })
  findAll(
    @Args('tier', { nullable: true, type: () => TournamentTier })
    tier?: TournamentTier,
    @Args('status', { nullable: true, type: () => TournamentStatus })
    status?: TournamentStatus,
  ) {
    return this.tournamentService.findAll({ tier, status });
  }

  @Query(() => TournamentType, { name: 'tournament' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.tournamentService.findOne(id);
  }

  @Query(() => [TournamentStageType], { name: 'tournamentStages' })
  getStages(@Args('tournamentId', { type: () => ID }) tournamentId: string) {
    return this.tournamentService.getStages(tournamentId);
  }

  @Query(() => [HeroStatsType], { name: 'heroStats' })
  getHeroStats(
    @Args('tournamentId', { type: () => ID }) tournamentId: string,
    @Args('stageId', { type: () => ID, nullable: true }) stageId?: string,
    @Args('sortBy', { nullable: true, defaultValue: 'picksAndBans' })
    sortBy?: string,
    @Args('limit', { nullable: true, defaultValue: 50 }) limit?: number,
  ) {
    return this.tournamentService.getHeroStats(
      tournamentId,
      stageId,
      sortBy,
      limit,
    );
  }

  @Query(() => [SyncLogType], { name: 'syncLogs' })
  getSyncLogs(
    @Args('tournamentId', { type: () => ID }) tournamentId: string,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit?: number,
  ) {
    return this.tournamentService.getSyncLogs(tournamentId, limit);
  }

  // ─── Mutations ───────────────────────────────────────────────────────────

  @Mutation(() => TournamentType)
  createTournament(@Args('input') input: CreateTournamentInput) {
    return this.tournamentService.create(input);
  }

  @Mutation(() => TournamentType)
  updateTournament(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTournamentInput,
  ) {
    return this.tournamentService.update(id, input);
  }

  @Mutation(() => SyncResultType, {
    description: 'Sinkronisasi penuh satu tournament dari Liquipedia',
  })
  syncTournament(@Args('id', { type: () => ID }) id: string) {
    return this.syncService.syncTournament(id);
  }

  @Mutation(() => SyncResultType, {
    description: 'Sinkronisasi satu stage dari tournament',
  })
  syncStage(
    @Args('tournamentId', { type: () => ID }) tournamentId: string,
    @Args('stageId', { type: () => ID }) stageId: string,
  ) {
    return this.syncService.syncStage(tournamentId, stageId);
  }

  @Mutation(() => TournamentType)
  deleteTournament(@Args('id', { type: () => ID }) id: string) {
    return this.tournamentService.remove(id);
  }
}
