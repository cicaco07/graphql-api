import { CreatePatchNoteInput } from './create-patch-note.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePatchNoteInput extends PartialType(CreatePatchNoteInput) {
  // @Field()
  // @IsOptional()
  // @IsString()
  // updated_by?: string;
}
