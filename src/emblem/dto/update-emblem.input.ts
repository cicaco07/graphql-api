import { CreateEmblemInput } from './create-emblem.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEmblemInput extends PartialType(CreateEmblemInput) {}
