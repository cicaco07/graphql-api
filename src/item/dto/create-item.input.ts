import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ItemTier } from '../enums/item-tier.enum';
import { CalculationAttributeInput } from './calculation-attribute.input';

@InputType()
export class CreateItemInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  tag?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  type: string;

  @Field(() => ItemTier)
  @IsEnum(ItemTier)
  @IsNotEmpty()
  tier: ItemTier;

  @Field(() => [String])
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  attributes: string[];

  @Field()
  @IsNotEmpty()
  price: number;

  @Field()
  @IsNotEmpty()
  image: string;

  @Field({ nullable: true })
  @IsOptional()
  story?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  description?: string[];

  @Field({ nullable: true })
  @IsOptional()
  tips?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  parent_items?: string[];

  @Field(() => [CalculationAttributeInput], { nullable: true })
  @IsOptional()
  calculation_attributes?: CalculationAttributeInput[];
}
