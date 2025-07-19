import { Module } from '@nestjs/common';
import { SkillDetailService } from './skill-detail.service';
import { SkillDetailResolver } from './skill-detail.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillDetail, SkillDetailSchema } from './schemas/skill-detail.schema';
import { Skill, SkillSchema } from 'src/skill/schemas/skill.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SkillDetail.name, schema: SkillDetailSchema },
      { name: Skill.name, schema: SkillSchema },
    ]),
  ],
  providers: [SkillDetailResolver, SkillDetailService],
})
export class SkillDetailModule {}
