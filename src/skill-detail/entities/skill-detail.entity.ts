import { ObjectType, Field, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class SkillDetail {
  @Field(() => ID) _id: string;
  @Field({ nullable: true }) level: number;
  @Field(() => GraphQLJSON, { nullable: true })
  attributes: Record<string, any>;
}
