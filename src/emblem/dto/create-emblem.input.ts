import { InputType, Field } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateEmblemInput {
  @Field(() => String) name: string;
  @Field(() => String) type: string;
  @Field(() => String) icon: string;
  @Field(() => String, { nullable: true }) cooldown?: string;
  @Field(() => String, { nullable: true }) benefit?: string;
  @Field(() => String, { nullable: true }) description?: string;
  @Field(() => GraphQLJSON, { nullable: true })
  attributes?: Record<string, any>;
}
