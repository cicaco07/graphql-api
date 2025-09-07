import { Field, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class GameModePatchNoteEntity {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => GraphQLJSON, { nullable: true })
  change_details?: Record<string, any>;
}
