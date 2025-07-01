import { InputType, Field } from '@nestjs/graphql';
import { CreateSkillDetailInput } from 'src/skill-detail/dto/create-skill-detail.input';

@InputType()
export class CreateSkillInput {
  @Field() name: string;
  @Field({ nullable: true }) type?: string;
  @Field(() => [String], { nullable: true }) tag?: string[];
  @Field({ nullable: true }) attack_effect?: number;
  @Field({ nullable: true }) skill_icon?: string;
  @Field({ nullable: true }) lite_description?: string;
  @Field({ nullable: true }) full_description?: string;
  @Field(() => [CreateSkillDetailInput], { nullable: true })
  skills_detail?: CreateSkillDetailInput[];
}
