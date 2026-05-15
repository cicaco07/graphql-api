import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBaseStatInput } from './dto/create-base-stat.input';
import { UpdateBaseStatInput } from './dto/update-base-stat.input';
import { InjectModel } from '@nestjs/mongoose';
import { BaseStat } from './schemas/base-stat.schema';
import { Model } from 'mongoose';
import { Hero } from 'src/hero/schemas/hero.schema';

@Injectable()
export class BaseStatService {
  constructor(
    @InjectModel(BaseStat.name) private baseStatModel: Model<BaseStat>,
    @InjectModel(Hero.name) private heroModel: Model<Hero>,
  ) {}

  async create(createBaseStatInput: CreateBaseStatInput): Promise<BaseStat> {
    return this.addBaseStatToHero(createBaseStatInput.heroId, createBaseStatInput);
  }

  async addBaseStatToHero(
    heroId: string,
    createBaseStatInput: CreateBaseStatInput,
  ): Promise<BaseStat> {
    const hero = await this.heroModel.findById(heroId);
    if (!hero) throw new NotFoundException('Hero not found');

    const existing = await this.baseStatModel.findOne({ hero: heroId });
    if (existing) throw new ConflictException('Hero already has a BaseStat');

    const { heroId: _heroId, ...statData } = createBaseStatInput;

    const baseStat = await this.baseStatModel.create({
      ...statData,
      hero: heroId,
    });

    hero.set('baseStat', baseStat._id);
    await hero.save();

    return this.findOne(String(baseStat._id));
  }

  async findAll(): Promise<BaseStat[]> {
    return this.baseStatModel.find().populate('hero').exec();
  }

  async findOne(id: string): Promise<BaseStat> {
    const baseStat = await this.baseStatModel.findById(id).populate('hero');
    if (!baseStat) throw new NotFoundException('BaseStat not found');
    return baseStat;
  }

  async findByHero(heroId: string): Promise<BaseStat> {
    const baseStat = await this.baseStatModel.findOne({ hero: heroId }).populate('hero');
    if (!baseStat) throw new NotFoundException('BaseStat not found for this hero');
    return baseStat;
  }

  async update(
    id: string,
    updateBaseStatInput: UpdateBaseStatInput,
  ): Promise<BaseStat> {
    const { heroId, ...statData } = updateBaseStatInput;
    const currentBaseStat = await this.baseStatModel.findById(id);
    if (!currentBaseStat) throw new NotFoundException('BaseStat not found');

    if (heroId && String(currentBaseStat.hero) !== heroId) {
      const hero = await this.heroModel.findById(heroId);
      if (!hero) throw new NotFoundException('Hero not found');

      const existing = await this.baseStatModel.findOne({
        hero: heroId,
        _id: { $ne: id },
      });
      if (existing) throw new ConflictException('Hero already has a BaseStat');

      if (currentBaseStat.hero) {
        await this.heroModel.findByIdAndUpdate(currentBaseStat.hero, {
          $unset: { baseStat: '' },
        });
      }

      hero.set('baseStat', currentBaseStat._id);
      await hero.save();
    }

    const baseStat = await this.baseStatModel.findByIdAndUpdate(
      id,
      {
        ...statData,
        ...(heroId ? { hero: heroId } : {}),
      },
      { new: true },
    ).populate('hero');
    if (!baseStat) throw new NotFoundException('BaseStat not found');
    return baseStat;
  }

  async remove(id: string): Promise<BaseStat> {
    const baseStat = await this.baseStatModel.findByIdAndDelete(id);
    if (!baseStat) throw new NotFoundException('BaseStat not found');

    if (baseStat.hero) {
      await this.heroModel.findByIdAndUpdate(baseStat.hero, {
        $unset: { baseStat: '' },
      });
    }

    return baseStat;
  }
}
