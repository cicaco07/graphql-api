import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum ChangeType {
  NEW = 'new',
  BUFF = 'buff',
  NERF = 'nerf',
  ADJUSTED = 'adjusted',
  REWORK = 'rework',
  REMOVED = 'removed',
}

registerEnumType(ChangeType, {
  name: 'ChangeType',
});

@ObjectType()
export class HeroChangeDetailEntity {
  @Field()
  name: string;

  @Field(() => ChangeType)
  change_type: ChangeType;

  @Field()
  description: string;
}

@ObjectType()
export class HeroChangeEntity {
  @Field()
  name: string;

  @Field({ nullable: true })
  alias?: string;

  @Field(() => ChangeType)
  change_type: ChangeType;

  @Field()
  description: string;

  @Field(() => [HeroChangeDetailEntity], { nullable: true })
  change_details: HeroChangeDetailEntity[];
}

@ObjectType()
export class HeroPatchNoteEntity {
  @Field(() => ID)
  _id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => [HeroChangeEntity])
  hero_changes: HeroChangeEntity[];
}
