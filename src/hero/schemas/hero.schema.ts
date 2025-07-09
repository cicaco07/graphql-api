import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { Skill } from 'src/skill/schemas/skill.schema';

@Schema()
export class Hero extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  alias: string;

  @Prop([String])
  role: string[];

  @Prop([String])
  type: string[];

  @Prop()
  avatar: string;

  @Prop()
  image: string;

  @Prop()
  short_description: string;

  @Prop()
  release_date: Date;

  @Prop()
  durability: number;

  @Prop()
  offense: number;

  @Prop()
  control_effect: number;

  @Prop()
  difficulty: number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Skill' })
  skills: Skill[];
}

export const HeroSchema = SchemaFactory.createForClass(Hero);
