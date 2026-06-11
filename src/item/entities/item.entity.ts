import { ObjectType, Field, Int, ID, registerEnumType } from '@nestjs/graphql';
import { ItemTier } from '../enums/item-tier.enum';

registerEnumType(ItemTier, {
  name: 'ItemTier',
});

@ObjectType()
export class Item {
  @Field(() => ID) _id: string;
  @Field() name: string;
  @Field({ nullable: true }) tag: string;
  @Field() type: string;
  @Field(() => ItemTier) tier: ItemTier;
  @Field(() => [String]) attributes: string[];
  @Field(() => Int) price: number;
  @Field() image: string;
  @Field({ nullable: true }) story?: string;
  @Field(() => [String]) description: string[];
  @Field({ nullable: true }) tips?: string;
  @Field(() => [ID], { nullable: true })
  parent_items?: string[];
}
