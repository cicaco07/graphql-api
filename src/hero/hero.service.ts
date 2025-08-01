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
    return this.heroModel.create(input);
  }

  async createHeroWithSkillDetail(input: CreateHeroInput): Promise<Hero> {
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
    return this.heroModel
      .find()
      .populate({
        path: 'skills',
        populate: {
          path: 'skills_detail',
        },
      })
      .exec();
  }

  async findOne(id: string): Promise<Hero> {
    const heroes = await this.heroModel.findById(id).populate({
      path: 'skills',
      populate: { path: 'skills_detail' },
    });

    if (!heroes) throw new NotFoundException('Hero not found');
    return heroes;
  }

  async findByName(name: string): Promise<Hero[]> {
    const hero = await this.heroModel
      .find({ name: new RegExp(name, 'i') })
      .populate({
        path: 'skills',
        populate: { path: 'skills_detail' },
      });

    if (hero.length === 0) throw new NotFoundException('No heroes found');
    return hero;
  }

  async update(id: string, input: UpdateHeroInput): Promise<Hero> {
    const updated = await this.heroModel.findByIdAndUpdate(id, input, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Hero not found');
    return updated;
  }

  // async updateHeroToSkills(heroId: string, skillIds: string[]): Promise<Hero> {
  //   const hero = await this.heroModel.findById(heroId);
  //   if (!hero) throw new NotFoundException('Hero not found');

  //   const skills = await this.skillModel.find({ _id: { $in: skillIds } });
  //   if (skills.length !== skillIds.length) {
  //     throw new NotFoundException('Some skills not found');
  //   }

  //   hero.skills = skills;
  //   await hero.save();

  //   for (const skill of skills) {
  //     skill.hero = new this.heroModel.base.Types.ObjectId(heroId);
  //     await skill.save();
  //   }

  //   await hero.populate({
  //     path: 'skills',
  //     populate: { path: 'skills_detail' },
  //   });

  //   return hero;
  // }

  async remove(id: string): Promise<Hero> {
    const deleted = await this.heroModel
      .findByIdAndDelete(id)
      .populate('skills');
    if (!deleted) throw new NotFoundException('Hero not found');

    // If deleted.skills is undefined, set it to empty array
    const skills: Skill[] = deleted.skills || [];

    await this.skillModel.deleteMany({ hero: id });

    const skillIds = skills.map((skill) => skill._id);
    await this.skillDetailModel.deleteMany({ skill: { $in: skillIds } });

    for (const skill of skills) {
      await this.skillModel.findByIdAndDelete(skill._id);
    }
    return deleted;
  }
}
