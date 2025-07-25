import { ObjectType, Field, ID } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class Emblem {
  @Field(() => ID) _id: string;
  @Field(() => String) name: string;
  @Field(() => String) type: string;
  @Field(() => String) icon: string;
  @Field(() => GraphQLJSON, { nullable: true })
  attributes: Record<string, any>;
  @Field(() => String, { nullable: true }) benefit?: string;
  @Field(() => String, { nullable: true }) description?: string;
  @Field(() => String, { nullable: true }) cooldown?: string;
}
