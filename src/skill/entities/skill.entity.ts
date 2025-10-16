import { ObjectType, Field, ID } from '@nestjs/graphql';
import { SkillDetail } from 'src/skill-detail/entities/skill-detail.entity';

@ObjectType()
export class Skill {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  type: string;

  @Field(() => [String])
  tag: string[];

  @Field({ nullable: true })
  attack_effect?: number;

  @Field()
  skill_icon: string;

  @Field()
  lite_description: string;

  @Field()
  full_description: string;

  @Field(() => [SkillDetail], { nullable: true })
  skills_detail?: SkillDetail[];
}
