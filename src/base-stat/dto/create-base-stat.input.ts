import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsInt, IsMongoId } from 'class-validator';

@InputType()
export class CreateBaseStatInput {
  @Field(() => ID)
  @IsMongoId()
  heroId: string;

  @Field(() => Int)
  @IsInt()
  hp: number;

  @Field(() => Int)
  @IsInt()
  mana: number;

  @Field(() => Int)
  @IsInt()
  energy: number;

  @Field(() => Int)
  @IsInt()
  hp_regen: number;

  @Field(() => Int)
  @IsInt()
  mana_regen: number;

  @Field(() => Int)
  @IsInt()
  energy_regen: number;

  @Field(() => Int)
  @IsInt()
  physical_attack: number;

  @Field(() => Int)
  @IsInt()
  physical_defense: number;

  @Field(() => Int)
  @IsInt()
  magic_power: number;

  @Field(() => Int)
  @IsInt()
  magic_defense: number;

  @Field(() => Int)
  @IsInt()
  attack_speed: number;

  @Field(() => Int)
  @IsInt()
  movement_speed: number;

  @Field(() => Int)
  @IsInt()
  attack_speed_ratio: number;

  @Field(() => Int)
  @IsInt()
  spell_vamp_ratio: number;

  @Field(() => Int)
  @IsInt()
  attack_range: number;
}
