import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class NavigationType {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  parent_id?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  route?: string;

  @Field({ nullable: true })
  component?: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  is_header: boolean;

  @Field()
  order: number;

  @Field(() => [String])
  permission: string[];

  @Field()
  level: number;

  @Field()
  is_active: boolean;

  @Field(() => [NavigationType], { nullable: true })
  children?: NavigationType[];
}
