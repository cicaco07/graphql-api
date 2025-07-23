import { ObjectType, Field, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Item {
  @Field(() => ID) _id: string;
  @Field() name: string;
  @Field() type: string;
  @Field() item_type: string;
  @Field(() => [String]) attributes: string[];
  @Field(() => Int) price: number;
  @Field() image: string;
  @Field({ nullable: true }) story?: string;
  @Field() isChildren: boolean;
  @Field({ nullable: true }) parent_item?: string;
}
