import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDetailInput } from './dto/create-skill-detail.input';
import { UpdateSkillDetailInput } from './dto/update-skill-detail.input';
import { InjectModel } from '@nestjs/mongoose';
import { SkillDetail } from './schemas/skill-detail.schema';
import { Model } from 'mongoose';

@Injectable()
export class SkillDetailService {
  constructor(
    @InjectModel(SkillDetail.name) private skillDetailModel: Model<SkillDetail>,
  ) {}

  async create(input: CreateSkillDetailInput): Promise<SkillDetail> {
    return this.skillDetailModel.create(input);
  }

  async findAll(): Promise<SkillDetail[]> {
    return this.skillDetailModel.find();
  }

  async findOne(id: string): Promise<SkillDetail> {
    const data = await this.skillDetailModel.findById(id);
    if (!data) throw new NotFoundException('Skill detail not found');
    return data;
  }

  async update(
    id: string,
    input: UpdateSkillDetailInput,
  ): Promise<SkillDetail> {
    const updated = await this.skillDetailModel.findByIdAndUpdate(id, input, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Skill detail not found');
    return updated;
  }

  async remove(id: string): Promise<SkillDetail> {
    const deleted = await this.skillDetailModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Skill detail not found');
    return deleted;
  }
}
