import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Skill } from 'src/skill/entities/skill.entity';

@ObjectType()
export class Hero {
  @Field(() => ID) _id: string;
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
  @Field(() => [Skill], { nullable: true })
  skills?: Skill[];
}
