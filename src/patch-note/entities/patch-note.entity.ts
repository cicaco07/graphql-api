import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum PatchNoteType {
  HERO_CHANGE = 'hero_change',
  SKILL_CHANGE = 'skill_change',
  ITEM_CHANGE = 'item_change',
  GAMEPLAY_CHANGE = 'gameplay_change',
  FEATURE_ADDITION = 'feature_addition',
  FEATURE_REMOVAL = 'feature_removal',
  BUG_FIX = 'bug_fix',
  BALANCE_CHANGE = 'balance_change',
}

export enum ChangeType {
  BUFF = 'buff',
  NERF = 'nerf',
  REWORK = 'rework',
  NEW = 'new',
  REMOVED = 'removed',
  FIXED = 'fixed',
  ADJUSTED = 'adjusted',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

registerEnumType(PatchNoteType, {
  name: 'PatchNoteType',
});

registerEnumType(ChangeType, {
  name: 'ChangeType',
});

registerEnumType(Priority, {
  name: 'Priority',
});

@ObjectType()
export class PatchNoteEntity {
  @Field(() => ID)
  _id: string;

  @Field()
  version: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => PatchNoteType)
  type: PatchNoteType;

  @Field(() => ChangeType)
  changeType: ChangeType;

  @Field(() => Priority)
  priority: Priority;

  @Field({ nullable: true })
  targetEntity?: string;

  @Field({ nullable: true })
  targetEntityId?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  previousValue?: string;

  @Field({ nullable: true })
  newValue?: string;

  @Field(() => String, { nullable: true })
  additionalData?: Record<string, any>;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  publishedAt: Date;

  @Field()
  createdBy: string;

  @Field({ nullable: true })
  updatedBy?: string;
}

// @ObjectType()
// export class TypeStats {
//   @Field()
//   _id: string;

//   @Field(() => Int)
//   count: number;
// }

// @ObjectType()
// export class PaginatedPatchNotesResponse {
//   @Field(() => [PatchNote])
//   data: PatchNote[];

//   @Field(() => Int)
//   total: number;

//   @Field(() => Int)
//   page: number;

//   @Field(() => Int)
//   limit: number;

//   @Field(() => Int)
//   totalPages: number;
// }
