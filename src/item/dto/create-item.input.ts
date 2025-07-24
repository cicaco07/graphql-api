import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateItemInput {
  @Field() name: string;
  @Field({ nullable: true }) tag?: string;
  @Field() type: string;
  @Field(() => [String]) attributes: string[];
  @Field() price: number;
  @Field() image: string;
  @Field({ nullable: true }) story?: string;
  @Field(() => [String], { nullable: true }) description?: string[];
  @Field({ nullable: true }) tips?: string;
  @Field(() => [String], { nullable: true }) parent_items?: string[];
}
