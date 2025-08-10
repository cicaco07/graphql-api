import { CreateNavigationInput } from './create-navigation.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNavigationInput extends PartialType(CreateNavigationInput) {}
