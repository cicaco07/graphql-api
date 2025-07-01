import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hero } from './schemas/hero.schema';
import { CreateHeroInput } from './dto/create-hero.input';
import { UpdateHeroInput } from './dto/update-hero.input';

@Injectable()
export class HeroService {
  constructor(@InjectModel(Hero.name) private heroModel: Model<Hero>) {}

  async create(input: CreateHeroInput): Promise<Hero> {
    return this.heroModel.create(input);
  }

  async findAll(): Promise<Hero[]> {
    return await this.heroModel.find().exec();
  }

  async findOne(id: string): Promise<Hero> {
    const hero = await this.heroModel.findById(id).exec();
    if (!hero) {
      throw new Error(`Hero with id ${id} not found`);
    }
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
