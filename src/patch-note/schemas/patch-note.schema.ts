import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { HeroPatchNote } from './hero-patch-note.schema';
import { BattlefieldPatchNote } from './battlefield-patch-note.schema';
import { SystemPatchNote } from './system-patch-note.schema';
import { GameModePatchNote } from './game-mode-patch-note.schema';
import { PatchNoteStatus, PatchNoteType } from '../entities/patch-note.entity';

@Schema({ timestamps: true })
export class PatchNote {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false, index: true })
  version?: string;

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;

  @Prop({ required: false })
  published_at?: Date;

  @Prop({
    required: true,
    enum: Object.values(PatchNoteType),
  })
  type: string;

  @Prop({ required: true })
  season: number;

  @Prop({ required: true })
  is_active: boolean;

  @Prop({
    required: true,
    enum: Object.values(PatchNoteStatus),
    default: PatchNoteStatus.DRAFT,
    index: true,
  })
  status: PatchNoteStatus;

  @Prop({ required: false })
  source_url?: string;

  @Prop({ required: false, unique: true, sparse: true })
  source_newsid?: string;

  @Prop({ required: false })
  summary?: string;

  @Prop({ required: false })
  raw_content?: string;

  @Prop({ required: false })
  imported_at?: Date;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'HeroPatchNote', default: [] })
  hero_changes: HeroPatchNote[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'BattlefieldPatchNote', default: [] })
  battlefield_changes: BattlefieldPatchNote[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'SystemPatchNote', default: [] })
  system_changes: SystemPatchNote[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'GameModePatchNote', default: [] })
  game_mode_changes: GameModePatchNote[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  created_by: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  updated_by?: string;

  @Prop({ required: false, default: null })
  deleted_at?: Date;
}

export const PatchNoteSchema = SchemaFactory.createForClass(PatchNote);
