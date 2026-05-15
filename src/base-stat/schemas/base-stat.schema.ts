import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';
import { Hero } from 'src/hero/schemas/hero.schema';

@Schema({ timestamps: true })
export class BaseStat extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hero', required: true, unique: true })
  hero: Hero;

  @Prop({ required: true })
  hp: number;

  @Prop()
  mana: number;

  @Prop()
  energy: number;

  @Prop({ required: true })
  hp_regen: number;

  @Prop()
  mana_regen: number;

  @Prop()
  energy_regen: number;

  @Prop()
  physical_attack: number;

  @Prop()
  physical_defense: number;

  @Prop()
  magic_power: number;

  @Prop()
  magic_defense: number;

  @Prop()
  attack_speed: number;

  @Prop()
  movement_speed: number;

  @Prop()
  attack_speed_ratio: number;

  @Prop()
  spell_vamp_ratio: number;

  @Prop()
  attack_range: number;
}

export const BaseStatSchema = SchemaFactory.createForClass(BaseStat);
