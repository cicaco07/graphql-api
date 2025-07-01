import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateSkillDetailInput {
  @Field(() => Int) level: number;
  @Field(() => Int) mana_cost: number;
  @Field(() => Int) base_damage: number;
  @Field(() => Int) duration: number;
  @Field(() => Int) cooldown: number;
  @Field(() => Int) spell_vamp_ratio: number;
}
