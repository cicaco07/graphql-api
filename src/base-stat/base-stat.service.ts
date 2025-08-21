import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.baseStatModel.create(createBaseStatInput);
  }

  // async addBaseStatToHero(
  //   heroId: string,
  //   createBaseStatInput: CreateBaseStatInput,
  // ) {
  //   const hero = await this.heroModel.findById(heroId);
  //   if (!hero) throw new NotFoundException('Hero not found');

  //   const baseStat = await this.baseStatModel.create({
  //     ...createBaseStatInput,
  //     hero: heroId,
  //   });

  //   (hero.baseStat as any[]).push(baseStat._id);
  //   await hero.save();

  //   return baseStat;
  // }

  async findAll(): Promise<BaseStat[]> {
    return this.baseStatModel.find().exec();
  }

  async findOne(id: string): Promise<BaseStat> {
    const baseStat = await this.baseStatModel.findById(id);
    if (!baseStat) throw new NotFoundException('BaseStat not found');
    return baseStat;
  }

  async update(
    id: string,
    updateBaseStatInput: UpdateBaseStatInput,
  ): Promise<BaseStat> {
    const baseStat = await this.baseStatModel.findByIdAndUpdate(
      id,
      updateBaseStatInput,
      { new: true },
    );
    if (!baseStat) throw new NotFoundException('BaseStat not found');
    return baseStat;
  }

  async remove(id: string): Promise<BaseStat> {
    const baseStat = await this.baseStatModel.findByIdAndDelete(id);
    if (!baseStat) throw new NotFoundException('BaseStat not found');
    return baseStat;
  }
}
