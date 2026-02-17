import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  Matches,
} from 'class-validator';
import { TournamentTier } from '../enum/tournament-tier.enum';
import { TournamentStatus } from '../enum/tournament-status.enum';

@InputType()
export class CreateTournamentInput {
  @Field() @IsNotEmpty() name: string;
  @Field() @IsNotEmpty() slug: string; // slug internal app, tidak boleh "/"
  @Field() @IsEnum(TournamentTier) tier: TournamentTier;
  @Field(() => Int) tierLevel: number;
  @Field({ nullable: true }) @IsOptional() region?: string;
  @Field({ nullable: true }) @IsOptional() prizePool?: string;
  @Field({ nullable: true }) @IsOptional() startDate?: Date;
  @Field({ nullable: true }) @IsOptional() endDate?: Date;
  @Field() @IsUrl() liquipediaUrl: string;

  // liquipediaSlug boleh mengandung "/" untuk path bersarang seperti "MSC/2025"
  // contoh valid: "M7_World_Championship", "MSC/2025", "MPL/Indonesia/Season_16"
  @Field()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_\-\/]+$/, {
    message: 'liquipediaSlug hanya boleh mengandung huruf, angka, _, -, dan /',
  })
  liquipediaSlug: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(TournamentStatus)
  status?: TournamentStatus;
}
