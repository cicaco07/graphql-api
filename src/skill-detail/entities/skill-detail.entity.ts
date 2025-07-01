import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class SkillDetail {
  @Field(() => ID) _id: string;
  @Field({ nullable: true }) level: number;
  @Field({ nullable: true }) mana_cost: number;
  @Field({ nullable: true }) base_damage: number;
  @Field({ nullable: true }) duration: number;
  @Field({ nullable: true }) cooldown: number;
  @Field({ nullable: true }) spell_vamp_ratio: number;
}
