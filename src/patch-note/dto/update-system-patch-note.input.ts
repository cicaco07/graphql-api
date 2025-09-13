import { InputType, PartialType } from '@nestjs/graphql';
import { CreateSystemPatchNoteInput } from './create-system-patch-note.input';

@InputType()
export class UpdateSystemPatchNoteInput extends PartialType(
  CreateSystemPatchNoteInput,
) {}
