import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BattleSpellDocument = BattleSpell & Document;

@Schema({ timestamps: true })
export class BattleSpell {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  icon?: string; // Path to uploaded image file

  @Prop({ required: true, type: Number })
  cooldown: number; // in seconds

  @Prop({ type: [String], default: [] })
  tag: string[];

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const BattleSpellSchema = SchemaFactory.createForClass(BattleSpell);
