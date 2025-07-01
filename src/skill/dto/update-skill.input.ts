import { CreateSkillInput } from './create-skill.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSkillInput extends PartialType(CreateSkillInput) {}
