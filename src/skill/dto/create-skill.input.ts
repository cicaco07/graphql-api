import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSkillInput {
  @Field() name: string;
  @Field({ nullable: true }) type?: string;
  @Field(() => [String], { nullable: true }) tag?: string[];
  @Field({ nullable: true }) attack_effect?: number;
  @Field({ nullable: true }) skill_icon?: string;
  @Field({ nullable: true }) lite_description?: string;
  @Field({ nullable: true }) full_description?: string;
}
