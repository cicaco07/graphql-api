import { IsOptional, IsString } from 'class-validator';
import { CreatePatchNoteInput } from './create-patch-note.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePatchNoteInput extends PartialType(CreatePatchNoteInput) {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  updated_by?: string;
}
