import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Skill } from 'src/skill/schemas/skill.schema';

@Schema()
export class SkillDetail extends Document {
  @Prop()
  level: number;

  @Prop()
  mana_cost: number;

  @Prop()
  base_damage: number;

  @Prop()
  duration: number;

  @Prop()
  cooldown: number;

  @Prop()
  spell_vamp_ratio: number;

  @Prop({ type: Types.ObjectId, ref: 'Skill' }) skill: Skill;
}

export const SkillDetailSchema = SchemaFactory.createForClass(SkillDetail);
