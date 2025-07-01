import { ObjectType, Field, ID } from '@nestjs/graphql';
import { SkillDetail } from 'src/skill-detail/entities/skill-detail.entity';

@ObjectType()
export class Skill {
  @Field(() => ID) _id: string;
  @Field() name: string;
  @Field({ nullable: true }) type?: string;
  @Field(() => [String], { nullable: true }) tag?: string[];
  @Field({ nullable: true }) attack_effect?: number;
  @Field({ nullable: true }) skill_icon?: string;
  @Field({ nullable: true }) lite_description?: string;
  @Field({ nullable: true }) full_description?: string;
  @Field(() => [SkillDetail], { nullable: true })
  skills_detail?: SkillDetail[];
}
