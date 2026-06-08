import { InputType, Float, Field, ID } from '@nestjs/graphql';
import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class CreateBaseStatInput {
  @Field(() => ID)
  @IsMongoId()
  heroId: string;

  @Field(() => Float)
  @IsNumber()
  hp: number;

  @Field(() => Float)
  @IsNumber()
  mana: number;

  @Field(() => Float)
  @IsNumber()
  energy: number;

  @Field(() => Float)
  @IsNumber()
  hp_regen: number;

  @Field(() => Float)
  @IsNumber()
  mana_regen: number;

  @Field(() => Float)
  @IsNumber()
  energy_regen: number;

  @Field(() => Float)
  @IsNumber()
  physical_attack: number;

  @Field(() => Float)
  @IsNumber()
  physical_defense: number;

  @Field(() => Float)
  @IsNumber()
  magic_power: number;

  @Field(() => Float)
  @IsNumber()
  magic_defense: number;

  @Field(() => Float)
  @IsNumber()
  attack_speed: number;

  @Field(() => Float)
  @IsNumber()
  movement_speed: number;

  @Field(() => Float)
  @IsNumber()
  attack_speed_ratio: number;

  @Field(() => Float)
  @IsNumber()
  spell_vamp_ratio: number;

  @Field(() => Float)
  @IsNumber()
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
