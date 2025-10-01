import { InputType, Field, ID, Int } from '@nestjs/graphql';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class BuildItemInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  itemId: string;

  @Field(() => Int)
  @Min(1)
  order: number;
}

@InputType()
export class CreateBuildInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  role: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => ID)
  @IsNotEmpty()
  heroId: string;

  @Field(() => [BuildItemInput])
  @IsArray()
  @ArrayMinSize(1)
  items: BuildItemInput[];

  @Field(() => [ID])
  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  emblemIds: string[];

  @Field(() => [ID])
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsMongoId({ each: true })
  battleSpellIds: string[];
}
