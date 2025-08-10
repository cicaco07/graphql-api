import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateNavigationInput {
  @Field({ nullable: true }) parent_id: string;
  @Field() name: string;
  @Field({ nullable: true }) icon: string;
  @Field({ nullable: true }) link: string;
  @Field(() => Int) order: number;
  @Field(() => Boolean) is_header: boolean;
  @Field(() => Boolean) is_active: boolean;
}
