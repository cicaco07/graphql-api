import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class BuildFilterInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  heroId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  role?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  keyword?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isOfficial?: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @Min(0)
  offset?: number = 0;
}

@InputType()
export class PopularBuildFilterInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsMongoId()
  heroId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  role?: string;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @Min(0)
  offset?: number = 0;
}
