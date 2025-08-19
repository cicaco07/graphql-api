import { CreateBattleSpellInput } from './create-battle-spell.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBattleSpellInput extends PartialType(
  CreateBattleSpellInput,
) {}
