import { InputType, Field } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ChangeType,
  PatchNoteType,
  Priority,
} from '../entities/patch-note.entity';

@InputType()
export class CreatePatchNoteInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  version: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => PatchNoteType)
  @IsEnum(PatchNoteType)
  type: PatchNoteType;

  @Field(() => ChangeType)
  @IsEnum(ChangeType)
  changeType: ChangeType;

  @Field(() => Priority, { nullable: true })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  targetEntity?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  targetEntityId?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  previousValue?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  newValue?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  additionalData?: Record<string, any>;

  @Field({ nullable: true })
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
