import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SyncLogDocument = SyncLog & Document;

@Schema({ timestamps: true })
export class SyncLog {
  @Prop({ type: Types.ObjectId, ref: 'Tournament', required: true }) tournamentId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'TournamentStage', default: null }) stageId: Types.ObjectId | null;
  @Prop({ enum: ['full', 'stage', 'manual'], default: 'manual' }) type: string;
  @Prop({ enum: ['started', 'success', 'failed'], default: 'started' }) status: string;
  @Prop({ default: 0 }) itemsSynced: number;
  @Prop() errorMessage: string;
  @Prop({ required: true }) startedAt: Date;
  @Prop() finishedAt: Date;
  @Prop({ default: 'user' }) triggeredBy: string;
}

export const SyncLogSchema = SchemaFactory.createForClass(SyncLog);