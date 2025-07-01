import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hero } from './schemas/hero.schema';
import { CreateHeroInput } from './dto/create-hero.input';
import { UpdateHeroInput } from './dto/update-hero.input';
import { Skill } from '../skill/schemas/skill.schema';

@Injectable()
export class HeroService {
  constructor(
    @InjectModel(Hero.name) private heroModel: Model<Hero>,
    @InjectModel(Skill.name) private skillModel: Model<Skill>,
  ) {}

  async create(input: CreateHeroInput): Promise<Hero> {
    const { skills = [], ...heroData } = input;

    const createdHero = await this.heroModel.create(heroData);

    const createdSkills: Skill[] = await Promise.all(
      skills.map(async (s) => {
        const newSkill = await this.skillModel.create({
          ...s,
          hero: createdHero._id,
        });
        return newSkill;
      }),
    );

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
