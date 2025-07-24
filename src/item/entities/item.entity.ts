import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Item {
  @Field(() => ID) _id: string;
  @Field() name: string;
  @Field({ nullable: true }) tag: string;
  @Field() type: string;
  @Field(() => [String]) attributes: string[];
  @Field(() => Int) price: number;
  @Field() image: string;
  @Field({ nullable: true }) story?: string;
  @Field(() => [String]) description: string[];
  @Field({ nullable: true }) tips?: string;
  @Field(() => [ID], { nullable: true })
  parent_items?: string[];
}
