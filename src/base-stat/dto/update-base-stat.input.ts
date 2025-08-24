import { CreateBaseStatInput } from './create-base-stat.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBaseStatInput extends PartialType(CreateBaseStatInput) {}
