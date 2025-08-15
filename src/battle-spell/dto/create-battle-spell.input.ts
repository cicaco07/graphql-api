import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class CreateBattleSpellInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  icon?: string;

  @Field()
  @IsNumber()
  @Min(0)
  cooldown: number;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  tag: string[];
}
