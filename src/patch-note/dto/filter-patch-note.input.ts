import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  ChangeType,
  PatchNoteEntity,
  PatchNoteType,
  Priority,
} from '../entities/patch-note.entity';

@InputType()
export class FilterPatchNoteInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  version?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(PatchNoteType, { each: true })
  types?: string[];

  @Field(() => [ChangeType], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(ChangeType, { each: true })
  changeTypes?: ChangeType[];

  @Field(() => [Priority], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsEnum(Priority, { each: true })
  priorities?: Priority[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  targetEntity?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @Field({ nullable: true, defaultValue: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @Field({ nullable: true, defaultValue: 'DESC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}

@ObjectType()
export class PaginatedPatchNotesResponse {
  @Field(() => [PatchNoteEntity])
  data: PatchNoteEntity[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}
