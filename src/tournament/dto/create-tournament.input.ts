import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsUrl, IsOptional, IsInt } from 'class-validator';
import { TournamentTier } from '../enum/tournament-tier.enum';
import { TournamentStatus } from '../enum/tournament-status.enum';

@InputType()
export class CreateTournamentInput {
  @Field() @IsNotEmpty() name: string;
  @Field() @IsNotEmpty() slug: string;
  @Field() @IsEnum(TournamentTier) tier: TournamentTier;
  @Field(() => Int) @IsNotEmpty() @IsInt() tierLevel: number;
  @Field({ nullable: true }) @IsOptional() region?: string;
  @Field({ nullable: true }) @IsOptional() prizePool?: string;
  @Field({ nullable: true }) @IsOptional() startDate?: Date;
  @Field({ nullable: true }) @IsOptional() endDate?: Date;
  @Field() @IsUrl() liquipediaUrl: string;
  @Field() @IsNotEmpty() liquipediaSlug: string;
  @Field({ nullable: true }) @IsOptional() @IsEnum(TournamentStatus) status?: TournamentStatus;
}