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

export enum PatchNoteStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

registerEnumType(PatchNoteType, {
  name: 'PatchNoteType',
});

registerEnumType(PatchNoteStatus, {
  name: 'PatchNoteStatus',
});

@ObjectType()
export class PatchNoteEntity {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  version?: string;

  @Field()
  start_date: Date;

  @Field()
  end_date: Date;

  @Field({ nullable: true })
  published_at?: Date;

  @Field(() => PatchNoteType)
  type: PatchNoteType;

  @Field()
  season: number;

  @Field()
  is_active: boolean;

  @Field(() => PatchNoteStatus)
  status: PatchNoteStatus;

  @Field({ nullable: true })
  source_url?: string;

  @Field({ nullable: true })
  source_newsid?: string;

  @Field({ nullable: true })
  summary?: string;

  @Field({ nullable: true })
  raw_content?: string;

  @Field({ nullable: true })
  imported_at?: Date;

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
