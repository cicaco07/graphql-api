import { CreateBuildInput } from './create-build.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBuildInput extends PartialType(CreateBuildInput) {}
