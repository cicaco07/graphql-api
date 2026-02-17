import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tournament,       TournamentSchema }       from './schemas/tournament.schema';
import { TournamentStage,  TournamentStageSchema }  from './schemas/tournament-stage.schema';
import { HeroStats,        HeroStatsSchema }        from './schemas/hero-stats.schema';
import { SyncLog,          SyncLogSchema }          from './schemas/sync-log.schema';
import { TournamentResolver } from './tournament.resolver';
import { TournamentService }  from './services/tournament.service';
import { SyncService }        from './services/sync.service';
import { ScraperService }     from './services/scraper.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tournament.name,      schema: TournamentSchema },
      { name: TournamentStage.name, schema: TournamentStageSchema },
      { name: HeroStats.name,       schema: HeroStatsSchema },
      { name: SyncLog.name,         schema: SyncLogSchema },
    ]),
  ],
  providers: [TournamentResolver, TournamentService, SyncService, ScraperService],
  exports:   [TournamentService, SyncService],
})
export class TournamentModule {}