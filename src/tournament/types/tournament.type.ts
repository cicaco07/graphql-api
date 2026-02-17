import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { SyncStatus } from '../enum/sync-status.enum';
import { TournamentTier } from '../enum/tournament-tier.enum';
import { TournamentStatus } from '../enum/tournament-status.enum';

registerEnumType(TournamentTier,   { name: 'TournamentTier' });
registerEnumType(TournamentStatus, { name: 'TournamentStatus' });
registerEnumType(SyncStatus,       { name: 'SyncStatus' });

@ObjectType()
export class TournamentType {
  @Field(() => ID)    _id: string;
  @Field()            name: string;
  @Field()            slug: string;
  @Field(() => TournamentTier)   tier: TournamentTier;
  @Field(() => Int)   tierLevel: number;
  @Field()            game: string;
  @Field({ nullable: true }) region?: string;
  @Field({ nullable: true }) logoUrl?: string;
  @Field({ nullable: true }) prizePool?: string;
  @Field({ nullable: true }) startDate?: Date;
  @Field({ nullable: true }) endDate?: Date;
  @Field()            liquipediaUrl: string;
  @Field()            liquipediaSlug: string;
  @Field(() => TournamentStatus) status: TournamentStatus;
  @Field({ nullable: true }) lastSyncedAt?: Date;
  @Field(() => SyncStatus)    syncStatus: SyncStatus;
  @Field({ nullable: true }) syncError?: string;
  @Field()            createdAt: Date;
  @Field()            updatedAt: Date;
}

@ObjectType()
export class TournamentStageType {
  @Field(() => ID)  _id: string;
  @Field(() => ID)  tournamentId: string;
  @Field()          name: string;
  @Field()          slug: string;
  @Field()          liquipediaUrl: string;
  @Field(() => Int) order: number;
}

@ObjectType()
export class HeroStatsType {
  @Field(() => ID)  _id: string;
  @Field(() => ID)  tournamentId: string;
  @Field(() => ID, { nullable: true }) stageId?: string;
  @Field()          heroName: string;
  @Field()          heroSlug: string;
  @Field({ nullable: true }) heroImageUrl?: string;
  @Field({ nullable: true }) role?: string;
  @Field()          picks: number;
  @Field()          bans: number;
  @Field()          picksAndBans: number;
  @Field()          wins: number;
  @Field()          losses: number;
  @Field()          winRate: number;
  @Field()          pickRate: number;
  @Field()          banRate: number;
  @Field()          presenceRate: number;
  @Field()          blueSidePicks: number;
  @Field()          blueSideWins: number;
  @Field()          redSidePicks: number;
  @Field()          redSideWins: number;
  @Field({ nullable: true }) syncedAt?: Date;
}

@ObjectType()
export class SyncResultType {
  @Field()          success: boolean;
  @Field()          message: string;
  @Field(() => Int) itemsSynced: number;
  @Field()          syncedAt: Date;
  @Field(() => [String]) errors: string[];
}

@ObjectType()
export class SyncLogType {
  @Field(() => ID)  _id: string;
  @Field(() => ID)  tournamentId: string;
  @Field(() => ID, { nullable: true }) stageId?: string;
  @Field()          type: string;
  @Field()          status: string;
  @Field(() => Int) itemsSynced: number;
  @Field({ nullable: true }) errorMessage?: string;
  @Field()          startedAt: Date;
  @Field({ nullable: true }) finishedAt?: Date;
  @Field()          triggeredBy: string;
  @Field()          createdAt: Date;
}