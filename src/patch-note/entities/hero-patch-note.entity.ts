import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum ChangeType {
  NEW = 'new',
  BUFF = 'buff',
  NERF = 'nerf',
  ADJUSTED = 'adjusted',
  REWORK = 'rework',
  REMOVED = 'removed',
}

export enum PatchType {
  MAJOR_UPDATE = 'Major Update',
  MINOR_UPDATE = 'Minor Update',
  HOTFIX = 'Hotfix',
  BALANCE_UPDATE = 'Balance Update',
}

registerEnumType(ChangeType, {
  name: 'ChangeType',
});

registerEnumType(PatchType, {
  name: 'PatchType',
});

@ObjectType()
export class SkillChangeEntity {
  @Field()
  name: string;

  @Field()
  type: string;

  @Field(() => ChangeType)
  change_type: ChangeType;

  @Field()
  description: string;
}

@ObjectType()
export class HeroChangeEntity {
  @Field()
  hero: string;

  @Field({ nullable: true })
  alias?: string;

  @Field(() => ChangeType)
  change_type: ChangeType;

  @Field()
  description: string;

  @Field(() => [SkillChangeEntity], { nullable: true })
  skills?: SkillChangeEntity[];

  @Field(() => [String], { nullable: true })
  changes?: string[];
}

@ObjectType()
export class HeroPatchNoteEntity {
  @Field(() => ID)
  _id: string;

  @Field()
  version: string;

  @Field(() => Int, { nullable: true })
  season?: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => PatchType, { nullable: true })
  type?: PatchType;

  @Field(() => [HeroChangeEntity])
  changes: HeroChangeEntity[];

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  publishedAt?: Date;

  @Field()
  createdBy: string;

  @Field({ nullable: true })
  updatedBy?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
