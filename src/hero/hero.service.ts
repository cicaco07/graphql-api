import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Hero } from './schemas/hero.schema';
import { CreateHeroInput } from './dto/create-hero.input';
import { UpdateHeroInput } from './dto/update-hero.input';
import { Skill } from '../skill/schemas/skill.schema';
import { SkillDetail } from '../skill-detail/schemas/skill-detail.schema';
import { BaseStat } from '../base-stat/schemas/base-stat.schema';
import { HeroFilterInput } from './dto/hero-filter.input';

@Injectable()
export class HeroService {
  constructor(
    @InjectModel(Hero.name) private heroModel: Model<Hero>,
    @InjectModel(Skill.name) private skillModel: Model<Skill>,
    @InjectModel(SkillDetail.name) private skillDetailModel: Model<SkillDetail>,
    @InjectModel(BaseStat.name) private baseStatModel: Model<BaseStat>,
  ) {}

  async create(createHeroInput: CreateHeroInput): Promise<Hero> {
    return this.heroModel.create(createHeroInput);
  }

  async createHeroWithSkill(createHeroInput: CreateHeroInput): Promise<Hero> {
    const { skills = [], ...heroData } = createHeroInput;

    const createdHero = await this.heroModel.create(heroData);

    const createdSkills: Skill[] = [];

    for (const skillInput of skills) {
      const skill = await this.skillModel.create({
        ...skillInput,
        hero: createdHero._id,
      });
      createdSkills.push(skill);
    }

    createdHero.skills = createdSkills;
    await createdHero.save();

    return this.findById(String(createdHero._id));
  }

  async createHeroWithSkillandSkillDetail(
    createHeroInput: CreateHeroInput,
  ): Promise<Hero> {
    const { skills = [], baseStat, ...heroData } = createHeroInput;

    const createdHero = await this.heroModel.create(heroData);

    const createdSkills = await this.createSkillsWithDetails(
      skills,
      createdHero._id,
    );

    createdHero.skills = createdSkills;

    if (baseStat) {
      const { heroId: _heroId, ...baseStatData } = baseStat;
      const createdBaseStat = await this.baseStatModel.create({
        ...baseStatData,
        hero: createdHero._id,
      });
      createdHero.set('baseStat', createdBaseStat._id);
    }

    await createdHero.save();

    return this.findById(String(createdHero._id));
  }

  private async createSkillsWithDetails(
    skills: any[],
    heroId: any,
  ): Promise<Skill[]> {
    const createdSkills: Skill[] = [];

    for (const skillInput of skills) {
      const { skills_detail = [], ...skillData } = skillInput;
      const skill = await this.skillModel.create({
        ...skillData,
        hero: heroId,
      });

      if (skills_detail.length > 0) {
        const detailIds = await this.createSkillDetails(
          skills_detail,
          skill._id,
        );
        skill.set('skills_detail', detailIds);
        await skill.save();
      }

      createdSkills.push(skill);
    }

    return createdSkills;
  }

  private async createSkillDetails(
    skillDetails: any[],
    skillId: any,
  ): Promise<any[]> {
    const detailIds: any[] = [];

    for (const detail of skillDetails) {
      const newDetail = await this.skillDetailModel.create({
        ...detail,
        skill: skillId,
      });
      detailIds.push(newDetail._id);
    }

    return detailIds;
  }

  async findAll(filter: HeroFilterInput = {}) {
    const query = this.heroFilterToQuery(filter);
    const limit = filter.limit ?? 10;
    const offset = filter.offset ?? 0;

    const [heroes, total] = await Promise.all([
      this.heroModel
        .find(query)
        .populate({
          path: 'skills',
          populate: {
            path: 'skills_detail',
          },
        })
        .populate('baseStat')
        .sort({ hero_order: 1 })
        .limit(limit)
        .skip(offset)
        .exec(),
      this.heroModel.countDocuments(query).exec(),
    ]);

    return {
      items: heroes,
      total,
      limit,
      offset,
    };
  }

  async findById(id: string): Promise<Hero> {
    const hero = await this.heroModel
      .findById(id)
      .populate({
        path: 'skills',
        populate: { path: 'skills_detail' },
      })
      .populate('baseStat')
      .exec();

    if (!hero) throw new NotFoundException('Hero not found');
    return hero;
  }

  async findByName(name: string): Promise<Hero[]> {
    const hero = await this.heroModel
      .find({ name: new RegExp(name, 'i') })
      .populate({
        path: 'skills',
        populate: { path: 'skills_detail' },
      })
      .populate('baseStat')
      .exec();

    if (hero.length === 0) throw new NotFoundException('No heroes found');
    return hero;
  }

  async update(id: string, updateHeroInput: UpdateHeroInput): Promise<Hero> {
    const updated = await this.heroModel.findByIdAndUpdate(
      id,
      updateHeroInput,
      {
        new: true,
      },
    );
    if (!updated) throw new NotFoundException('Hero not found');
    return updated;
  }

  private heroFilterToQuery(filter: HeroFilterInput): FilterQuery<Hero> {
    const query: FilterQuery<Hero> = {};

    if (filter.role) query.role = filter.role;
    if (filter.type) query.type = filter.type;
    if (filter.region) query.region = filter.region;
    if (filter.keyword) {
      query.$or = [
        { name: { $regex: filter.keyword, $options: 'i' } },
        { alias: { $regex: filter.keyword, $options: 'i' } },
        { speciality: { $regex: filter.keyword, $options: 'i' } },
        { short_description: { $regex: filter.keyword, $options: 'i' } },
      ];
    }

    return query;
  }

  async remove(id: string): Promise<Hero> {
    const deleted = await this.heroModel
      .findByIdAndDelete(id)
      .populate('skills');
    if (!deleted) throw new NotFoundException('Hero not found');

    const skills: Skill[] = deleted.skills || [];
    const skillIds = skills.map((skill) => skill._id);

    await Promise.all([
      this.skillModel.deleteMany({ hero: id }),
      this.skillDetailModel.deleteMany({ skill: { $in: skillIds } }),
      this.baseStatModel.deleteOne({ hero: id }),
    ]);

    return deleted;
  }
}
