import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import mongoose from 'mongoose';

@Schema()
export class Skill extends Document {
  @Prop({ required: true }) name: string;
  @Prop() type: string;
  @Prop([String]) tag: string[];
  @Prop() attack_effect: number;
  @Prop() skill_icon: string;
  @Prop() lite_description: string;
  @Prop() full_description: string;

  // @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Skill' })
  // skills: Skill[];
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
