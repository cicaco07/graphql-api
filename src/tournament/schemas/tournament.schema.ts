import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TournamentTier } from '../enum/tournament-tier.enum';
import { TournamentStatus } from '../enum/tournament-status.enum';
import { SyncStatus } from '../enum/sync-status.enum';

export type TournamentDocument = Tournament & Document;

@Schema({ timestamps: true })
export class Tournament {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true }) slug: string;
  @Prop({ required: true, enum: TournamentTier }) tier: TournamentTier;
  @Prop({ required: true, enum: [1, 2, 3] }) tierLevel: number;
  @Prop({ default: 'mobile-legends' }) game: string;
  @Prop() region: string;
  @Prop() logoUrl: string;
  @Prop() prizePool: string;
  @Prop() startDate: Date;
  @Prop() endDate: Date;
  @Prop({ required: true }) liquipediaUrl: string;
  @Prop({ required: true }) liquipediaSlug: string;
  @Prop({ enum: TournamentStatus, default: TournamentStatus.UPCOMING })
  status: TournamentStatus;
  @Prop() lastSyncedAt: Date;
  @Prop({ enum: SyncStatus, default: SyncStatus.IDLE }) syncStatus: SyncStatus;
  @Prop() syncError: string;
}

export const TournamentSchema = SchemaFactory.createForClass(Tournament);
TournamentSchema.index({ tier: 1, status: 1 });
