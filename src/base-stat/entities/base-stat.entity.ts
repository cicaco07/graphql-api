import { ObjectType, Field, Float, ID } from '@nestjs/graphql';
import { Hero } from 'src/hero/entities/hero.entity';

@ObjectType()
export class BaseStat {
  @Field(() => ID)
  _id: string;

  @Field(() => Hero)
  hero: Hero;

  @Field(() => Float)
  hp: number;

  @Field(() => Float)
  mana: number;

  @Field(() => Float)
  energy: number;

  @Field(() => Float)
  hp_regen: number;

  @Field(() => Float)
  mana_regen: number;

  @Field(() => Float)
  energy_regen: number;

  @Field(() => Float)
  physical_attack: number;

  @Field(() => Float)
  physical_defense: number;

  @Field(() => Float)
  magic_power: number;

  @Field(() => Float)
  magic_defense: number;

  @Field(() => Float)
  attack_speed: number;

  @Field(() => Float)
  movement_speed: number;

  @Field(() => Float)
  attack_speed_ratio: number;

  @Field(() => Float)
  spell_vamp_ratio: number;

  @Field(() => Float)
  attack_range: number;

  @Field(() => Float, { nullable: true })
  hp_growth: number;

  @Field(() => Float, { nullable: true })
  mana_growth: number;

  @Field(() => Float, { nullable: true })
  energy_growth: number;

  @Field(() => Float, { nullable: true })
  hp_regen_growth: number;

  @Field(() => Float, { nullable: true })
  mana_regen_growth: number;

  @Field(() => Float, { nullable: true })
  energy_regen_growth: number;

  @Field(() => Float, { nullable: true })
  physical_attack_growth: number;

  @Field(() => Float, { nullable: true })
  physical_defense_growth: number;

  @Field(() => Float, { nullable: true })
  magic_defense_growth: number;

  @Field(() => Float, { nullable: true })
  attack_speed_growth: number;
}
