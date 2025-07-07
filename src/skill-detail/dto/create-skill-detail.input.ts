import { InputType, Field, Int } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateSkillDetailInput {
  @Field(() => Int) level: number;
  @Field(() => GraphQLJSON)
  attributes: Record<string, any>;
}
