import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeroService } from './hero.service';
import { HeroResolver } from './hero.resolver';
import { Hero, HeroSchema } from './schemas/hero.schema';
import { Skill, SkillSchema } from 'src/skill/schemas/skill.schema';
import {
  SkillDetail,
  SkillDetailSchema,
} from 'src/skill-detail/schemas/skill-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hero.name, schema: HeroSchema },
      { name: Skill.name, schema: SkillSchema },
      { name: SkillDetail.name, schema: SkillDetailSchema },
    ]),
  ],
  providers: [HeroResolver, HeroService],
})
export class HeroModule {}
