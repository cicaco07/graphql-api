import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class BattleSpell {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  icon?: string;

  @Field()
  cooldown: number;

  @Field(() => [String])
  tag: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
