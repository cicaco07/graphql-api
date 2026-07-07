import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CalculationAttributeInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  key: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  value?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  min_value?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  max_value?: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  value_type: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  scaling_stat?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  source: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  trigger: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  condition?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  target?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  cooldown?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  max_stacks?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  cap?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  note?: string;
}
