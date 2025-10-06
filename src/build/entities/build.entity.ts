import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from 'src/auth/entities/user.entity';
import { BattleSpell } from 'src/battle-spell/entities/battle-spell.entity';
import { Emblem } from 'src/emblem/entities/emblem.entity';
import { Hero } from 'src/hero/entities/hero.entity';
import { Item } from 'src/item/entities/item.entity';

// @ObjectType()
// export class BuildRating {
//   @Field(() => ID)
//   userId: string;

//   @Field(() => Float)
//   rating: number;

//   @Field()
//   createdAt: Date;
// }

@ObjectType()
export class BuildItemObject {
  @Field(() => Item)
  item: Item;

  @Field(() => Int)
  order: number;
}

@ObjectType()
export class BuildEntity {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Hero)
  hero: Hero;

  @Field(() => [BuildItemObject])
  items: Array<{ item: Item; order: number }>;

  @Field(() => [Emblem])
  emblems: Emblem[];

  @Field(() => [BattleSpell])
  battle_spells: BattleSpell[];

  @Field(() => User)
  user: User;

  @Field()
  is_official: boolean;

  // @Field(() => [BuildRating])
  // ratings: BuildRating[];

  // @Field(() => Float)
  // rating: number;

  // @Field(() => Int)
  // totalRatings: number;
}
