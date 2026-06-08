import { InputType, Int, Float, Field, ID } from '@nestjs/graphql';
import { IsInt, IsMongoId, IsNumber, IsOptional } from 'class-validator';

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

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  hp_growth?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  mana_growth?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  energy_growth?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  hp_regen_growth?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  mana_regen_growth?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  energy_regen_growth?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  physical_attack_growth?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  physical_defense_growth?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  magic_defense_growth?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  attack_speed_growth?: number;
}
