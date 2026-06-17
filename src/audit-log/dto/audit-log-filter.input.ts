import { InputType, Field, Int, ID } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

@InputType()
export class AuditLogFilterInput {
  @Field(() => ID, { nullable: true, description: 'Filter by user ID' })
  @IsOptional()
  @IsString()
  userId?: string;

  @Field({
    nullable: true,
    description: 'Filter by mutation action name (e.g. "createHero")',
  })
  @IsOptional()
  @IsString()
  action?: string;

  @Field({
    nullable: true,
    description: 'Filter logs from this date (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @Field({
    nullable: true,
    description: 'Filter logs until this date (ISO 8601)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Filter by success status',
  })
  @IsOptional()
  success?: boolean;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 1,
    description: 'Page number (1-based)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 20,
    description: 'Number of items per page (max 100)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
