import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Skill } from './schemas/skill.schema';
import { Model } from 'mongoose';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { Hero } from 'src/hero/schemas/hero.schema';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(Skill.name) private skillModel: Model<Skill>,
    @InjectModel(Hero.name) private heroModel: Model<Hero>,
  ) {}

  async create(input: CreateSkillInput): Promise<Skill> {
    return this.skillModel.create(input);
  }

  async addSkillToHero(
    heroId: string,
    input: CreateSkillInput,
  ): Promise<Skill> {
    const hero = await this.heroModel.findById(heroId);
    if (!hero) throw new NotFoundException('Hero not found');

    const skill = await this.skillModel.create({ ...input, hero: heroId });

    (hero.skills as any[]).push(skill._id);
    await hero.save();

    return skill;
  }

  async findAll(): Promise<Skill[]> {
    return this.skillModel
      .find()
      .populate({
        path: 'skills_detail',
      })
      .exec();
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillModel.findById(id).populate({
      path: 'skills_detail',
    });
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async update(id: string, input: UpdateSkillInput): Promise<Skill> {
    const updated = await this.skillModel.findByIdAndUpdate(id, input, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Skill not found');
    return updated;
  }

  async remove(id: string): Promise<Skill> {
    const deleted = await this.skillModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Skill not found');
    return deleted;
  }
}
