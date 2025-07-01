import { CreateHeroInput } from './create-hero.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateHeroInput extends PartialType(CreateHeroInput) {}
