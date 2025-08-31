import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatchNoteDocument = PatchNote & Document;

@Schema({ timestamps: true })
export class PatchNote {
  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    enum: [
      'hero_change',
      'skill_change',
      'item_change',
      'gameplay_change',
      'feature_addition',
      'feature_removal',
      'bug_fix',
      'balance_change',
    ],
  })
  type: string;

  @Prop({
    required: true,
    enum: ['buff', 'nerf', 'rework', 'new', 'removed', 'fixed', 'adjusted'],
  })
  changeType: string;

  @Prop({
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  })
  priority: string;

  @Prop()
  targetEntity: string;

  @Prop()
  targetEntityId: string;

  @Prop([String])
  tags: string[];

  @Prop()
  previousValue: string;

  @Prop()
  newValue: string;

  @Prop({ type: Object })
  additionalData: Record<string, any>;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  publishedAt: Date;

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  updatedBy: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PatchNoteSchema = SchemaFactory.createForClass(PatchNote);
