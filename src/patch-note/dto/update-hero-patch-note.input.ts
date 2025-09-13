import { InputType, PartialType } from '@nestjs/graphql';
import { CreateHeroPatchNoteInput } from './create-hero-patch-note.input';

@InputType()
export class UpdateHeroPatchNoteInput extends PartialType(
  CreateHeroPatchNoteInput,
) {}
