import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Hero } from './hero.entity';

@ObjectType()
export class PaginatedHeroes {
  @Field(() => [Hero])
  items: Hero[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  offset: number;
}
