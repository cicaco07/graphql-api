import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBattleSpellInput } from './dto/create-battle-spell.input';
import { UpdateBattleSpellInput } from './dto/update-battle-spell.input';
import { InjectModel } from '@nestjs/mongoose';
import { BattleSpell } from './schemas/battle-spell.schema';
import { Model } from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BattleSpellService {
  constructor(
    @InjectModel(BattleSpell.name) private battleSpellModel: Model<BattleSpell>,
  ) {}

  async create(
    createBattleSpellInput: CreateBattleSpellInput,
  ): Promise<BattleSpell> {
    const createdBattleSpell = new this.battleSpellModel(
      createBattleSpellInput,
    );
    return createdBattleSpell.save();
  }

  async findAll(): Promise<BattleSpell[]> {
    return this.battleSpellModel.find().exec();
  }

  async findOne(id: string): Promise<BattleSpell> {
    const battleSpell = await this.battleSpellModel.findById(id).exec();
    if (!battleSpell) {
      throw new NotFoundException(`BattleSpell with ID "${id}" not found`);
    }
    return battleSpell;
  }

  async update(
    updateBattleSpellInput: UpdateBattleSpellInput,
  ): Promise<BattleSpell> {
    const { id, ...updateData } = updateBattleSpellInput;

    const updatedBattleSpell = await this.battleSpellModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedBattleSpell) {
      throw new NotFoundException(`BattleSpell with ID "${id}" not found`);
    }

    return updatedBattleSpell;
  }

  async remove(id: string): Promise<BattleSpell> {
    const deletedBattleSpell = await this.battleSpellModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedBattleSpell) {
      throw new NotFoundException(`BattleSpell with ID "${id}" not found`);
    }

    // Delete associated icon file if exists
    if (deletedBattleSpell.icon) {
      const filePath = path.join(
        process.cwd(),
        'uploads',
        deletedBattleSpell.icon,
      );
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    return deletedBattleSpell;
  }

  async updateIcon(id: string, filename: string): Promise<BattleSpell> {
    const battleSpell = await this.findOne(id);

    // Delete old icon file if exists
    if (battleSpell.icon) {
      const oldFilePath = path.join(process.cwd(), 'uploads', battleSpell.icon);
      try {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (error) {
        console.error('Error deleting old file:', error);
      }
    }

    const updatedBattleSpell = await this.battleSpellModel
      .findByIdAndUpdate(id, { icon: filename }, { new: true })
      .exec();

    if (!updatedBattleSpell) {
      throw new NotFoundException(`BattleSpell with ID "${id}" not found`);
    }

    return updatedBattleSpell;
  }

  async createWithIcon(
    createBattleSpellInput: CreateBattleSpellInput,
    filename?: string,
  ): Promise<BattleSpell> {
    const data = {
      ...createBattleSpellInput,
      icon: filename || null,
    };

    const createdBattleSpell = new this.battleSpellModel(data);
    return createdBattleSpell.save();
  }
}
