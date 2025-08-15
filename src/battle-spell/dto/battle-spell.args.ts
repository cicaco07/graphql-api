import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class BattleSpellArgs {
  @Field(() => Int, { defaultValue: 0 })
  skip = 0;

  @Field(() => Int, { defaultValue: 25 })
  take = 25;

  @Field({ nullable: true })
  search?: string;
}
