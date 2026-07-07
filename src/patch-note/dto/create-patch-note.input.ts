import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PatchNoteStatus, PatchNoteType } from '../entities/patch-note.entity';
import { CreateHeroPatchNoteInput } from './create-hero-patch-note.input';
import { CreateBattlefieldPatchNoteInput } from './create-battlefield-patch-note.input';
import { CreateSystemPatchNoteInput } from './create-system-patch-note.input';
import { CreateGameModePatchNoteInput } from './create-game-mode-patch-note.input';
import { CreatePatchChangeInput } from './create-patch-change.input';

@InputType()
export class CreatePatchNoteInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  version?: string;

  @Field()
  @IsNotEmpty()
  @IsDate()
  start_date: Date;

  @Field()
  @IsNotEmpty()
  @IsDate()
  end_date: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  published_at?: Date;

  @Field(() => PatchNoteType)
  @IsNotEmpty()
  @IsEnum(PatchNoteType)
  type: PatchNoteType;

  @Field()
  @IsNotEmpty()
  season: number;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;

  @Field(() => PatchNoteStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PatchNoteStatus)
  status?: PatchNoteStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  source_url?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  source_newsid?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  summary?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  raw_content?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  imported_at?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  created_by?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  updated_by?: string;

  @Field(() => [CreateHeroPatchNoteInput], { nullable: true })
  @IsOptional()
  hero_changes?: CreateHeroPatchNoteInput[];

  @Field(() => [CreateBattlefieldPatchNoteInput], { nullable: true })
  @IsOptional()
  battlefield_changes?: CreateBattlefieldPatchNoteInput[];

  @Field(() => [CreateSystemPatchNoteInput], { nullable: true })
  @IsOptional()
  system_changes?: CreateSystemPatchNoteInput[];

  @Field(() => [CreateGameModePatchNoteInput], { nullable: true })
  @IsOptional()
  game_mode_changes?: CreateGameModePatchNoteInput[];

  @Field(() => [CreatePatchChangeInput], { nullable: true })
  @IsOptional()
  changes?: CreatePatchChangeInput[];
}
