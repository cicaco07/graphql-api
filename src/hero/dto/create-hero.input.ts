import { InputType, Field } from '@nestjs/graphql';
import { CreateSkillInput } from '../../skill/dto/create-skill.input';

@InputType()
export class CreateHeroInput {
  @Field() name: string;
  @Field({ nullable: true }) alias?: string;
  @Field(() => [String]) role: string[];
  @Field(() => [String]) type: string[];
  @Field({ nullable: true }) avatar?: string;
  @Field({ nullable: true }) image?: string;
  @Field({ nullable: true }) short_description?: string;
  @Field({ nullable: true }) realese_date?: Date;
  @Field({ nullable: true }) durability?: number;
  @Field({ nullable: true }) offense?: number;
  @Field({ nullable: true }) control_effect?: number;
  @Field({ nullable: true }) difficulty?: number;
  @Field(() => [CreateSkillInput], { nullable: true })
  skills?: CreateSkillInput[];
}
