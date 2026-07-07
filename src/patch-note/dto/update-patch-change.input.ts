import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePatchChangeInput } from './create-patch-change.input';

@InputType()
export class UpdatePatchChangeInput extends PartialType(CreatePatchChangeInput) {}
