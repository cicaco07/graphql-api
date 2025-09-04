import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ChangeType, PatchType } from '../entities/hero-patch-note.entity';

@InputType()
export class CreateSkillChangeInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  type: string;

  @Field(() => ChangeType)
  @IsEnum(ChangeType)
  change_type: ChangeType;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;
}

@InputType()
export class CreateHeroChangeInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  hero: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  alias?: string;

  @Field(() => ChangeType)
  @IsEnum(ChangeType)
  change_type: ChangeType;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => [CreateSkillChangeInput], { nullable: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSkillChangeInput)
  skills?: CreateSkillChangeInput[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  changes?: string[]; // JSON string array for additional changes
}

@InputType()
export class CreateHeroPatchNoteInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  version: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  season?: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => PatchType, {
    nullable: true,
    defaultValue: PatchType.BALANCE_UPDATE,
  })
  @IsOptional()
  @IsEnum(PatchType)
  type?: PatchType;

  @Field(() => [CreateHeroChangeInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHeroChangeInput)
  changes: CreateHeroChangeInput[];

  @Field({ nullable: true, defaultValue: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  publishedAt?: Date;

  @Field()
  @IsNotEmpty()
  @IsString()
  createdBy: string;
}
