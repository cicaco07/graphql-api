import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HeroStatsDocument = HeroStats & Document;

@Schema({ timestamps: true })
export class HeroStats {
  @Prop({ type: Types.ObjectId, ref: 'Tournament', required: true }) tournamentId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'TournamentStage', default: null }) stageId: Types.ObjectId | null;
  @Prop({ required: true }) heroName: string;
  @Prop({ required: true }) heroSlug: string;
  @Prop() heroImageUrl: string;
  @Prop() role: string;

  // Pick / Ban Counts
  @Prop({ default: 0 }) picks: number;
  @Prop({ default: 0 }) bans: number;
  @Prop({ default: 0 }) picksAndBans: number;
  @Prop({ default: 0 }) wins: number;
  @Prop({ default: 0 }) losses: number;

  // Rates (0-100)
  @Prop({ default: 0 }) winRate: number;
  @Prop({ default: 0 }) pickRate: number;
  @Prop({ default: 0 }) banRate: number;
  @Prop({ default: 0 }) presenceRate: number;

  // Side splits
  @Prop({ default: 0 }) blueSidePicks: number;
  @Prop({ default: 0 }) blueSideWins: number;
  @Prop({ default: 0 }) redSidePicks: number;
  @Prop({ default: 0 }) redSideWins: number;

  @Prop() syncedAt: Date;
}

export const HeroStatsSchema = SchemaFactory.createForClass(HeroStats);
HeroStatsSchema.index({ tournamentId: 1, stageId: 1, heroSlug: 1 }, { unique: true });