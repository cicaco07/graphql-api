import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class BaseStat {
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
}
