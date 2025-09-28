import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateSkillDetailInput } from 'src/skill-detail/dto/create-skill-detail.input';

@InputType()
export class CreateSkillInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field(() => [String])
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  tag: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  attack_effect?: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  skill_icon: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lite_description: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  full_description: string;

  @Field(() => [CreateSkillDetailInput], { nullable: true })
  @IsOptional()
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateSkillDetailInput)
  skills_detail?: CreateSkillDetailInput[];
}
