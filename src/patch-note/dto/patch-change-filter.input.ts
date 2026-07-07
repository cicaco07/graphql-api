import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  PatchChangeType,
  PatchTargetType,
} from '../entities/patch-change.entity';

@InputType()
export class PatchChangeFilterInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  patchNoteId?: string;

  @Field(() => PatchTargetType, { nullable: true })
  @IsOptional()
  @IsEnum(PatchTargetType)
  targetType?: PatchTargetType;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  targetId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  targetName?: string;

  @Field(() => PatchChangeType, { nullable: true })
  @IsOptional()
  @IsEnum(PatchChangeType)
  changeType?: PatchChangeType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  version?: string;

  @Field({ nullable: true })
  @IsOptional()
  includeDrafts?: boolean;
}
