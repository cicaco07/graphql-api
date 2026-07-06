import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BuildEntity } from './build.entity';

@ObjectType()
export class PaginatedBuilds {
  @Field(() => [BuildEntity])
  items: BuildEntity[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  offset: number;
}
