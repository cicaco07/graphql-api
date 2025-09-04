import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HeroPatchNoteDocument = HeroPatchNote & Document;

@Schema({ _id: false })
export class SkillChange {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({
    required: true,
    enum: ['new', 'buff', 'nerf', 'adjusted', 'reworked', 'removed'],
  })
  change_type: string;

  @Prop({ required: true })
  description: string;
}

@Schema({ _id: false })
export class HeroChange {
  @Prop({ required: true })
  hero: string;

  @Prop()
  alias: string;

  @Prop({
    required: true,
    enum: ['new', 'buff', 'nerf', 'adjusted', 'reworked', 'removed'],
  })
  change_type: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [SkillChange], default: [] })
  skills?: SkillChange[];

  @Prop({ type: [Object], default: [] })
  changes?: Record<string, any>[];
}

@Schema({ timestamps: true })
export class HeroPatchNote {
  @Prop({ required: true })
  version: string;

  @Prop()
  season?: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    enum: ['Major Update', 'Minor Update', 'Hotfix', 'Balance Update'],
    default: 'Balance Update',
  })
  type?: string;

  @Prop({ type: [HeroChange], default: [] })
  changes: HeroChange[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  publishedAt?: Date;

  @Prop({ required: true })
  createdBy: string;

  @Prop()
  updatedBy?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const HeroPatchNoteSchema = SchemaFactory.createForClass(HeroPatchNote);
export const SkillChangeSchema = SchemaFactory.createForClass(SkillChange);
export const HeroChangeSchema = SchemaFactory.createForClass(HeroChange);
