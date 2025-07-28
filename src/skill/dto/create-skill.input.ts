import { InputType, Field } from '@nestjs/graphql';
import { CreateSkillDetailInput } from 'src/skill-detail/dto/create-skill-detail.input';

@InputType()
export class CreateSkillInput {
  @Field() name: string;
  @Field() type?: string;
  @Field(() => [String]) tag: string[];
  @Field({ nullable: true }) attack_effect?: number;
  @Field() skill_icon: string;
  @Field() lite_description: string;
  @Field() full_description: string;
  @Field(() => [CreateSkillDetailInput], { nullable: true })
  skills_detail?: CreateSkillDetailInput[];
}
