import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateEmblemInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  icon: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  cooldown?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  benefit?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @IsOptional()
  attributes?: Record<string, any>;
}
