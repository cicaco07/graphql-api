import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class BattleSpell {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  icon: string;

  @Field()
  cooldown: number;

  @Field()
  tag: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
