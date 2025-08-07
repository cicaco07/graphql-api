import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SkillDetail } from 'src/skill-detail/schemas/skill-detail.schema';

@Schema()
export class Skill extends Document {
  @Prop({ required: true }) name: string;
  @Prop() type: string;
  @Prop([String]) tag: string[];
  @Prop() attack_effect: number;
  @Prop() skill_icon: string;
  @Prop() lite_description: string;
  @Prop() full_description: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: 'SkillDetail' }] })
  skills_detail: SkillDetail[];
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
