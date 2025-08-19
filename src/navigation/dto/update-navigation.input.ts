import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateNavigationInput {
  @Field(() => ID)
  @IsString()
  _id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  parent_id?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  icon?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  route?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  is_header?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  order?: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  roles?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  permissions?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  level?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  component?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  is_visible?: boolean;
}
