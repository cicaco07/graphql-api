import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillResolver } from './skill.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Skill, SkillSchema } from './schemas/skill.schema';
import { Hero, HeroSchema } from 'src/hero/schemas/hero.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Skill.name, schema: SkillSchema },
      { name: Hero.name, schema: HeroSchema },
    ]),
  ],
  providers: [SkillResolver, SkillService],
})
export class SkillModule {}
