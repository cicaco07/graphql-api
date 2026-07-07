import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  PatchChangeType,
  PatchTargetType,
} from '../entities/patch-change.entity';

@Schema({ _id: false })
export class PatchChangeDetail {
  @Prop({ required: true })
  field: string;

  @Prop({ required: false })
  old_value?: string;

  @Prop({ required: false })
  new_value?: string;

  @Prop({ required: false })
  unit?: string;

  @Prop({ required: true })
  raw_text: string;

  @Prop({ required: false })
  note?: string;

  @Prop({ type: Object, required: false })
  metadata?: Record<string, unknown>;
}

@Schema({ timestamps: true })
export class PatchChange {
  @Prop({ type: Types.ObjectId, ref: 'PatchNote', required: true, index: true })
  patch_note: Types.ObjectId;

  @Prop({
    required: true,
    enum: Object.values(PatchTargetType),
    index: true,
  })
  target_type: PatchTargetType;

  @Prop({ type: Types.ObjectId, required: false, index: true })
  target_ref?: Types.ObjectId;

  @Prop({ required: true, index: true })
  target_name: string;

  @Prop({
    required: true,
    enum: Object.values(PatchChangeType),
    index: true,
  })
  change_type: PatchChangeType;

  @Prop({ required: true })
  section: string;

  @Prop({ required: false })
  title?: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [PatchChangeDetail], default: [] })
  details?: PatchChangeDetail[];

  @Prop({ required: false })
  raw_text?: string;

  @Prop({ required: true, default: 0 })
  order: number;

  @Prop({ required: false, default: null })
  deleted_at?: Date;
}

export const PatchChangeSchema = SchemaFactory.createForClass(PatchChange);
PatchChangeSchema.index({ patch_note: 1, target_type: 1, target_ref: 1 });
PatchChangeSchema.index({ patch_note: 1, target_type: 1, target_name: 1 });
