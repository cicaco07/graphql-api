import { InputType, Int, Field, ID, ObjectType } from '@nestjs/graphql';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@ObjectType()
export class NavigationType {
  @Field(() => ID)
  _id: string;

  @Field()
  name: string;

  @Field(() => ID, { nullable: true })
  parent_id: string;

  @Field({ nullable: true })
  icon: string;

  @Field({ nullable: true })
  route: string;

  @Field()
  is_header: boolean;

  @Field()
  is_active: boolean;

  @Field(() => Int)
  order: number;

  @Field(() => [String])
  roles: string[];

  @Field(() => [String])
  permissions: string[];

  @Field({ nullable: true })
  description: string;

  @Field(() => Int)
  level: number;

  @Field({ nullable: true })
  component: string;

  @Field()
  is_visible: boolean;

  @Field(() => [NavigationType], { nullable: true })
  children?: NavigationType[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateNavigationInput {
  @Field()
  @IsString()
  name: string;

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

  @Field({ defaultValue: false })
  @IsBoolean()
  is_header: boolean;

  @Field({ defaultValue: true })
  @IsBoolean()
  is_active: boolean;

  @Field(() => Int)
  @IsNumber()
  order: number;

  @Field(() => [String])
  @IsArray()
  roles: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  permissions?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int, { defaultValue: 0 })
  @IsNumber()
  level: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  component?: string;

  @Field({ defaultValue: true })
  @IsBoolean()
  is_visible: boolean;
}
