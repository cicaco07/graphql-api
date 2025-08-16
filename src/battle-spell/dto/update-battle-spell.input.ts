import { CreateBattleSpellInput } from './create-battle-spell.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdateBattleSpellInput extends PartialType(
  CreateBattleSpellInput,
) {
  @Field(() => ID)
  @IsString()
  id: string;
}
