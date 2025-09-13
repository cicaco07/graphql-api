import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { HeroPatchNoteEntity } from './hero-patch-note.entity';
import { BattlefieldPatchNoteEntity } from './battlefield-patch-note.entity';
import { SystemPatchNoteEntity } from './system-patch-note.entity';
import { GameModePatchNoteEntity } from './game-mode-patch-note.entity';

export enum PatchNoteType {
  MAJOR = 'major',
  MINOR = 'minor',
  PATCH = 'patch',
  HOTFIX = 'hotfix',
}

registerEnumType(PatchNoteType, {
  name: 'PatchNoteType',
});

@ObjectType()
export class PatchNoteEntity {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field()
  start_date: Date;

  @Field()
  end_date: Date;

  @Field(() => PatchNoteType)
  type: PatchNoteType;

  @Field()
  season: number;

  @Field()
  is_active: boolean;

  @Field(() => [HeroPatchNoteEntity], { nullable: true })
  hero_changes?: HeroPatchNoteEntity[];

  @Field(() => [BattlefieldPatchNoteEntity], { nullable: true })
  battlefield_changes?: BattlefieldPatchNoteEntity[];

  @Field(() => [SystemPatchNoteEntity], { nullable: true })
  system_changes?: SystemPatchNoteEntity[];

  @Field(() => [GameModePatchNoteEntity], { nullable: true })
  game_mode_changes?: GameModePatchNoteEntity[];

  @Field({ nullable: true })
  created_by?: string;

  @Field({ nullable: true })
  updated_by?: string;

  @Field({ nullable: true })
  deleted_at?: Date;
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
