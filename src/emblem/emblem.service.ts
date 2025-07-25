import { Injectable } from '@nestjs/common';
import { CreateEmblemInput } from './dto/create-emblem.input';
import { UpdateEmblemInput } from './dto/update-emblem.input';
import { InjectModel } from '@nestjs/mongoose';
import { Emblem } from './schemas/emblem.schema';
import { Model } from 'mongoose';

@Injectable()
export class EmblemService {
  constructor(@InjectModel(Emblem.name) private emblemModel: Model<Emblem>) {}

  async create(input: CreateEmblemInput): Promise<Emblem> {
    return this.emblemModel.create(input);
  }

  async findAll(): Promise<Emblem[]> {
    return this.emblemModel.find().exec();
  }

  async findOne(id: string): Promise<Emblem> {
    const emblem = await this.emblemModel.findById(id).exec();
    if (!emblem) {
      throw new Error(`Emblem with ID ${id} not found`);
    }
    return emblem;
  }

  async update(id: string, input: UpdateEmblemInput): Promise<Emblem> {
    const updatedEmblem = await this.emblemModel
      .findByIdAndUpdate(id, input, { new: true, runValidators: true })
      .exec();
    if (!updatedEmblem) {
      throw new Error(`Emblem with ID ${id} not found`);
    }
    return updatedEmblem;
  }

  async remove(id: string): Promise<Emblem> {
    const deletedEmblem = await this.emblemModel.findByIdAndDelete(id).exec();
    if (!deletedEmblem) {
      throw new Error(`Emblem with ID ${id} not found`);
    }
    return deletedEmblem;
  }
}
