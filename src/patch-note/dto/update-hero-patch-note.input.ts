import { InputType, Field, ID, PartialType, OmitType } from '@nestjs/graphql';
import { IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import {
  CreateHeroPatchNoteInput,
  CreateSkillChangeInput,
  CreateHeroChangeInput,
} from './create-hero-patch-note.input';

@InputType()
export class UpdateSkillChangeInput extends PartialType(
  CreateSkillChangeInput,
) {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  _id?: string; // untuk tracking skill yang sudah ada
}

@InputType()
export class UpdateHeroChangeInput extends PartialType(
  OmitType(CreateHeroChangeInput, ['skills']),
) {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  _id?: string; // untuk tracking hero change yang sudah ada

  @Field(() => [UpdateSkillChangeInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSkillChangeInput)
  skills?: UpdateSkillChangeInput[];
}

@InputType()
export class UpdateHeroPatchNoteInput extends PartialType(
  OmitType(CreateHeroPatchNoteInput, ['changes']),
) {
  @Field(() => ID)
  @IsString()
  id: string; // gunakan 'id' bukan '_id' untuk consistency

  @Field(() => [UpdateHeroChangeInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateHeroChangeInput)
  changes?: UpdateHeroChangeInput[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
