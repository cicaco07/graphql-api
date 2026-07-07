import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsString, Max, Min } from 'class-validator';

@InputType()
export class HeroFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  keyword?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  role?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  region?: string;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @Min(1)
  @Max(200)
  limit?: number = 10;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @Min(0)
  offset?: number = 0;
}
