import { InputType, Field } from '@nestjs/graphql';
import { CreateSkillInput } from '../../skill/dto/create-skill.input';
import { CreateBaseStatInput } from 'src/base-stat/dto/create-base-stat.input';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateHeroInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  alias: string;

  @Field(() => [String])
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  role: string[];

  @Field(() => [String])
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  type: string[];

  @Field()
  @IsNotEmpty()
  @IsString()
  avatar: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  image: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  short_description: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  release_date: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  durability: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  offense: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  control_effect: number;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  difficulty: number;

  @Field(() => [CreateSkillInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkillInput)
  skills?: CreateSkillInput[];

  @Field(() => [CreateBaseStatInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBaseStatInput)
  base_stats?: CreateBaseStatInput[];
}
