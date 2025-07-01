import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Skill } from './schemas/skill.schema';
import { Model } from 'mongoose';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';

@Injectable()
export class SkillService {
  constructor(@InjectModel(Skill.name) private skillModel: Model<Skill>) {}

  async create(input: CreateSkillInput): Promise<Skill> {
    return this.skillModel.create(input);
  }

  async findAll(): Promise<Skill[]> {
    return this.skillModel.find().exec();
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillModel.findById(id);
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
