import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';
import { Hero } from 'src/hero/entities/hero.entity';

@ObjectType()
export class BaseStat {
  @Field(() => ID)
  _id: string;

  @Field(() => Hero)
  hero: Hero;

  @Field(() => Int)
  hp: number;

  @Field(() => Int)
  mana: number;

  @Field(() => Int)
  energy: number;

  @Field(() => Int)
  hp_regen: number;

  @Field(() => Int)
  mana_regen: number;

  @Field(() => Int)
  energy_regen: number;

  @Field(() => Int)
  physical_attack: number;

  @Field(() => Int)
  physical_defense: number;

  @Field(() => Int)
  magic_power: number;

  @Field(() => Int)
  magic_defense: number;

  @Field(() => Int)
  attack_speed: number;

  @Field(() => Int)
  movement_speed: number;

  @Field(() => Int)
  attack_speed_ratio: number;

  @Field(() => Int)
  spell_vamp_ratio: number;

  @Field(() => Int)
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
