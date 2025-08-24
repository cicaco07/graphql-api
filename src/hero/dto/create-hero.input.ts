import { InputType, Field } from '@nestjs/graphql';
import { CreateSkillInput } from '../../skill/dto/create-skill.input';
import { CreateBaseStatInput } from 'src/base-stat/dto/create-base-stat.input';

@InputType()
export class CreateHeroInput {
  @Field() name: string;
  @Field() alias: string;
  @Field(() => [String]) role: string[];
  @Field(() => [String]) type: string[];
  @Field() avatar: string;
  @Field() image: string;
  @Field() short_description: string;
  @Field() release_date: Date;
  @Field() durability: number;
  @Field() offense: number;
  @Field() control_effect: number;
  @Field() difficulty: number;
  @Field(() => [CreateSkillInput], { nullable: true })
  skills?: CreateSkillInput[];
  @Field(() => [CreateBaseStatInput], { nullable: true })
  base_stats?: CreateBaseStatInput[];
}
