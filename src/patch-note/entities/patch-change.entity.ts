import { Field, ID, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { PatchNoteEntity } from './patch-note.entity';

export enum PatchTargetType {
  HERO = 'hero',
  ITEM = 'item',
  BATTLEFIELD = 'battlefield',
  SYSTEM = 'system',
  GAME_MODE = 'game_mode',
}

export enum PatchChangeType {
  NEW = 'new',
  BUFF = 'buff',
  NERF = 'nerf',
  ADJUSTED = 'adjusted',
  REWORK = 'rework',
  REMOVED = 'removed',
}

registerEnumType(PatchTargetType, {
  name: 'PatchTargetType',
});

registerEnumType(PatchChangeType, {
  name: 'PatchChangeType',
});

@ObjectType()
@InputType('PatchChangeDetailInputType')
export class PatchChangeDetailEntity {
  @Field()
  field: string;

  @Field({ nullable: true })
  old_value?: string;

  @Field({ nullable: true })
  new_value?: string;

  @Field({ nullable: true })
  unit?: string;

  @Field()
  raw_text: string;

  @Field({ nullable: true })
  note?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata?: Record<string, unknown>;
}

@ObjectType()
export class PatchChangeEntity {
  @Field(() => ID)
  _id: string;

  @Field(() => PatchNoteEntity, { nullable: true })
  patch_note?: PatchNoteEntity;

  @Field(() => PatchTargetType)
  target_type: PatchTargetType;

  @Field({ nullable: true })
  target_ref?: string;

  @Field()
  target_name: string;

  @Field(() => PatchChangeType)
  change_type: PatchChangeType;

  @Field()
  section: string;

  @Field({ nullable: true })
  title?: string;

  @Field()
  description: string;

  @Field(() => [PatchChangeDetailEntity], { nullable: true })
  details?: PatchChangeDetailEntity[];

  @Field({ nullable: true })
  raw_text?: string;

  @Field()
  order: number;

  @Field({ nullable: true })
  deleted_at?: Date;
}
