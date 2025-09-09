import { InputType, PartialType } from '@nestjs/graphql';
import { CreateGameModePatchNoteInput } from './create-game-mode-patch-note.input';

@InputType()
export class UpdateGameModePatchNoteInput extends PartialType(
  CreateGameModePatchNoteInput,
) {}
