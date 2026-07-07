import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CalculationAttribute {
  @Field()
  key: string;

  @Field(() => Float, { nullable: true })
  value?: number;

  @Field(() => Float, { nullable: true })
  min_value?: number;

  @Field(() => Float, { nullable: true })
  max_value?: number;

  @Field()
  value_type: string;

  @Field({ nullable: true })
  scaling_stat?: string;

  @Field()
  source: string;

  @Field()
  trigger: string;

  @Field({ nullable: true })
  condition?: string;

  @Field({ nullable: true })
  target?: string;

  @Field(() => Float, { nullable: true })
  duration?: number;

  @Field(() => Float, { nullable: true })
  cooldown?: number;

  @Field(() => Int, { nullable: true })
  max_stacks?: number;

  @Field(() => Float, { nullable: true })
  cap?: number;

  @Field({ nullable: true })
  note?: string;
}
