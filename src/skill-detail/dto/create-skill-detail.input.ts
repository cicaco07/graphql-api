import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateSkillDetailInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  level: number;

  @Field(() => GraphQLJSON)
  @IsNotEmpty()
  attributes: Record<string, any>;
}
