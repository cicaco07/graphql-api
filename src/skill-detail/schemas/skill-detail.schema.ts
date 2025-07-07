import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { Skill } from 'src/skill/schemas/skill.schema';

@Schema()
export class SkillDetail extends Document {
  @Prop()
  level: number;

  @Prop({ type: MongooseSchema.Types.Mixed })
  attributes: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: 'Skill' }) skill: Skill;
}

export const SkillDetailSchema = SchemaFactory.createForClass(SkillDetail);
