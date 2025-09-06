import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { HeroPatchNote } from './hero-patch-note.schema';
import { BattlefieldPatchNote } from './battlefield-patch-note.schema';
import { SystemPatchNote } from './system-patch-note.schema';
import { GameModePatchNote } from './game-mode-patch-note.schema';

export type PatchNoteDocument = PatchNote & Document;

@Schema({ timestamps: true })
export class PatchNote {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;

  @Prop({
    required: true,
    enum: ['major', 'minor', 'patch', 'hotfix'],
  })
  type: string;

  @Prop({ required: true })
  season: number;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'HeroPatchNote' })
  hero_changes: HeroPatchNote[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BattlefieldPatchNote' })
  battlefield_changes: BattlefieldPatchNote[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'SystemPatchNote' })
  system_changes: SystemPatchNote[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'GameModePatchNote' })
  game_mode_changes: GameModePatchNote[];

  @Prop({ required: true })
  created_by: string;

  @Prop({ required: false })
  updated_by?: string;
}

export const PatchNoteSchema = SchemaFactory.createForClass(PatchNote);
