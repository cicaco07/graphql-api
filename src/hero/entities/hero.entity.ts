import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Skill } from 'src/skill/entities/skill.entity';

@ObjectType()
export class Hero {
  @Field(() => ID) _id: string;
  @Field() name: string;
  @Field({ nullable: true }) alias?: string;
  @Field(() => [String]) role: string[];
  @Field(() => [String]) type: string[];
  @Field({ nullable: true }) avatar?: string;
  @Field({ nullable: true }) image?: string;
  @Field({ nullable: true }) short_description?: string;
  @Field({ nullable: true }) release_date?: Date;
  @Field({ nullable: true }) durability?: number;
  @Field({ nullable: true }) offense?: number;
  @Field({ nullable: true }) control_effect?: number;
  @Field({ nullable: true }) difficulty?: number;
  @Field(() => [Skill], { nullable: true })
  skills?: Skill[];
}
