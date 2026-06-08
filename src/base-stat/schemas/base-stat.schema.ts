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

  @Prop()
  hp_growth: number;

  @Prop()
  mana_growth: number;

  @Prop()
  energy_growth: number;

  @Prop()
  hp_regen_growth: number;

  @Prop()
  mana_regen_growth: number;

  @Prop()
  energy_regen_growth: number;

  @Prop()
  physical_attack_growth: number;

  @Prop()
  physical_defense_growth: number;

  @Prop()
  magic_defense_growth: number;

  @Prop()
  attack_speed_growth: number;
}

export const BaseStatSchema = SchemaFactory.createForClass(BaseStat);
