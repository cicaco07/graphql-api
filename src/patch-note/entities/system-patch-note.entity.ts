import { Field, ID, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class SystemPatchNoteEntity {
  @Field(() => ID)
  _id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => GraphQLJSON, { nullable: true })
  change_details?: Record<string, any>;
}
