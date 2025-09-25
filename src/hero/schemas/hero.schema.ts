import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { BaseStat } from 'src/base-stat/schemas/base-stat.schema';
import { Skill } from 'src/skill/schemas/skill.schema';

@Schema()
export class Hero extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  alias: string;

  @Prop({ type: [String], required: true })
  role: string[];

  @Prop({ type: [String], required: true })
  type: string[];

  @Prop({ required: true })
  avatar: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  short_description: string;

  @Prop({ required: true })
  release_date: Date;

  @Prop({ required: true })
  durability: number;

  @Prop({ required: true })
  offense: number;

  @Prop({ required: true })
  control_effect: number;

  @Prop({ required: true })
  difficulty: number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Skill' })
  skills: Skill[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'BaseStat' })
  baseStat: BaseStat[];
}

export const HeroSchema = SchemaFactory.createForClass(Hero);
