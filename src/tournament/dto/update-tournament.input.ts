import { CreateTournamentInput } from './create-tournament.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTournamentInput extends PartialType(CreateTournamentInput) { }
