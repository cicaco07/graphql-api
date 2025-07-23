import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateItemInput {
  @Field() name: string;
  @Field() type: string;
  @Field() item_type: string;
  @Field(() => [String]) attributes: string[];
  @Field() price: number;
  @Field() image: string;
  @Field({ nullable: true }) story?: string;
  @Field() isChildren: boolean;
  @Field({ nullable: true }) parent_item?: string;
}
