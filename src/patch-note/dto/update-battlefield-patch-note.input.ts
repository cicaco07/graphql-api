import { InputType, PartialType } from '@nestjs/graphql';
import { CreateBattlefieldPatchNoteInput } from './create-battlefield-patch-note.input';

@InputType()
export class UpdateBattlefieldPatchNoteInput extends PartialType(
  CreateBattlefieldPatchNoteInput,
) {}
