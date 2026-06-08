import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TournamentStageDocument = TournamentStage & Document;

@Schema({ timestamps: true })
export class TournamentStage {
  @Prop({ type: Types.ObjectId, ref: 'Tournament', required: true })
  tournamentId: Types.ObjectId;
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) slug: string;
  @Prop({ required: true }) liquipediaUrl: string;
  @Prop({ default: 0 }) order: number;
}

export const TournamentStageSchema =
  SchemaFactory.createForClass(TournamentStage);
TournamentStageSchema.index({ tournamentId: 1, slug: 1 }, { unique: true });
