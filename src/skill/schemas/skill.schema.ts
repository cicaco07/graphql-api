import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SkillDetail } from 'src/skill-detail/schemas/skill-detail.schema';

@Schema()
export class Skill extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: [String], required: true })
  tag: string[];

  @Prop()
  attack_effect: number;

  @Prop({ required: true })
  skill_icon: string;

  @Prop({ required: true })
  lite_description: string;

  @Prop({ required: true })
  full_description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'SkillDetail' }] })
  skills_detail: SkillDetail[];
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
