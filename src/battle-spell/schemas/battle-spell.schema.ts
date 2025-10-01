import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BattleSpell extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  icon?: string;

  @Prop({ required: true, type: Number })
  cooldown: number;

  @Prop({ required: true })
  tag: string;
}

export const BattleSpellSchema = SchemaFactory.createForClass(BattleSpell);
