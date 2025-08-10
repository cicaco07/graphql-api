import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Navigation {
  @Field(() => ID) _id: string;
  @Field({ nullable: true }) parent_id: string;
  @Field(() => String) name: string;
  @Field({ nullable: true }) icon: string;
  @Field({ nullable: true }) link: string;
  @Field(() => Int) order: number;
  @Field(() => Boolean) is_header: boolean;
  @Field(() => Boolean) is_active: boolean;
}
