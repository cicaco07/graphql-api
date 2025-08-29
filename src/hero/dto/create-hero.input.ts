import { InputType, Field } from '@nestjs/graphql';
import { CreateSkillInput } from '../../skill/dto/create-skill.input';
import { CreateBaseStatInput } from 'src/base-stat/dto/create-base-stat.input';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  @IsNumber()
  release_date: Date;

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
  skills?: CreateSkillInput[];

  @Field(() => [CreateBaseStatInput], { nullable: true })
  base_stats?: CreateBaseStatInput[];
}
