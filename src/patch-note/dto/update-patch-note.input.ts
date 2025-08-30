import { IsOptional, IsString } from 'class-validator';
import { CreatePatchNoteInput } from './create-patch-note.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdatePatchNoteInput extends PartialType(CreatePatchNoteInput) {
  @Field(() => ID)
  @IsString()
  _id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
