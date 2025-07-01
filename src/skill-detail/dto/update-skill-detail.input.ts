import { CreateSkillDetailInput } from './create-skill-detail.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSkillDetailInput extends PartialType(
  CreateSkillDetailInput,
) {}
