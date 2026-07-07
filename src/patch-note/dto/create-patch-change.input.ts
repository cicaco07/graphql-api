import { Field, ID, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  PatchChangeType,
  PatchTargetType,
} from '../entities/patch-change.entity';

@InputType()
export class PatchChangeDetailInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  field: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  old_value?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  new_value?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  unit?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  raw_text: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  note?: string;
}

@InputType()
export class CreatePatchChangeInput {
  @Field(() => PatchTargetType)
  @IsEnum(PatchTargetType)
  target_type: PatchTargetType;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  target_ref?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  target_name: string;

  @Field(() => PatchChangeType)
  @IsEnum(PatchChangeType)
  change_type: PatchChangeType;

  @Field()
  @IsString()
  @IsNotEmpty()
  section: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => [PatchChangeDetailInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PatchChangeDetailInput)
  details?: PatchChangeDetailInput[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  raw_text?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  order?: number;
}
