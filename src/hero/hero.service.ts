import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hero } from './schemas/hero.schema';
import { CreateHeroInput } from './dto/create-hero.input';
import { UpdateHeroInput } from './dto/update-hero.input';
import { Skill } from '../skill/schemas/skill.schema';
import { SkillDetail } from 'src/skill-detail/schemas/skill-detail.schema';

@Injectable()
export class HeroService {
  constructor(
    @InjectModel(Hero.name) private heroModel: Model<Hero>,
    @InjectModel(Skill.name) private skillModel: Model<Skill>,
    @InjectModel(SkillDetail.name) private skillDetailModel: Model<SkillDetail>,
  ) {}

  async create(input: CreateHeroInput): Promise<Hero> {
    const { skills = [], ...heroData } = input;

    const createdHero = await this.heroModel.create(heroData);

    const createdSkills: Skill[] = [];

    for (const skillInput of skills) {
      const { skills_detail = [], ...skillData } = skillInput;
      const skill = await this.skillModel.create({
        ...skillData,
        hero: createdHero._id,
      });

      const detailIds: any[] = [];

      for (const detail of skills_detail) {
        const newDetail = await this.skillDetailModel.create({
          ...detail,
          skill: skill._id,
        });
        detailIds.push(newDetail._id);
      }

      skill.set('skills_detail', detailIds);
      await skill.save();

      createdSkills.push(skill);
    }

    createdHero.skills = createdSkills;
    await createdHero.save();

    return this.findOne(String(createdHero._id));
  }

  async findAll(): Promise<Hero[]> {
    return await this.heroModel.find().exec();
  }

  async findOne(id: string): Promise<Hero> {
    const hero = await this.heroModel.findById(id).populate({
      path: 'skills',
      populate: { path: 'skills_detail' },
    });

    if (!hero) throw new NotFoundException('Hero not found');
    return hero;
  }

  async update(id: string, input: UpdateHeroInput): Promise<Hero> {
    const updated = await this.heroModel.findByIdAndUpdate(id, input, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Hero not found');
    return updated;
  }

  async remove(id: string): Promise<Hero> {
    const deleted = await this.heroModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Hero not found');
    return deleted;
  }
}
