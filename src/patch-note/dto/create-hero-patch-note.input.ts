import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ChangeType } from '../entities/hero-patch-note.entity';

@InputType()
export class HeroChangeDetailInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => ChangeType)
  @IsEnum(ChangeType)
  @IsNotEmpty()
  change_type: ChangeType;

  @Field()
  @IsString()
  @IsOptional()
  description?: string;
}

@InputType()
export class HeroChangeInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  alias?: string;

  @Field(() => ChangeType)
  @IsEnum(ChangeType)
  @IsNotEmpty()
  change_type: ChangeType;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => [HeroChangeDetailInput], { nullable: true })
  @IsOptional()
  change_details?: HeroChangeDetailInput[];
}

@InputType()
export class CreateHeroPatchNoteInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => [HeroChangeInput], { nullable: true })
  @IsOptional()
  hero_changes?: HeroChangeInput[];
}
