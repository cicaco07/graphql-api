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
    const data = {
      ...createBattleSpellInput,
      cooldown: Number(createBattleSpellInput.cooldown),
    };
    const createdBattleSpell = new this.battleSpellModel(data);
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
    id: string,
    updateBattleSpellInput: UpdateBattleSpellInput,
  ): Promise<BattleSpell> {
    const existingBattleSpell = await this.findOne(id);

    if (
      updateBattleSpellInput.icon &&
      updateBattleSpellInput.icon !== existingBattleSpell.icon
    ) {
      if (existingBattleSpell.icon) {
        this.deleteImageFile(existingBattleSpell.icon);
      }
    }

    const updatedBattleSpell = await this.battleSpellModel
      .findByIdAndUpdate(id, updateBattleSpellInput, { new: true })
      .exec();

    if (!updatedBattleSpell) {
      throw new NotFoundException(`BattleSpell with ID "${id}" not found`);
    }

    return updatedBattleSpell;
  }

  private deleteImageFile(imagePath: string): void {
    try {
      const fullPath = path.join(process.cwd(), imagePath.replace(/^\//, ''));
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error('Error deleting image file:', error);
    }
  }

  async remove(id: string): Promise<boolean> {
    const battleSpell = await this.findOne(id);

    // Hapus file ikon
    if (battleSpell.icon) {
      this.deleteImageFile(battleSpell.icon);
    }

    await this.battleSpellModel.findByIdAndDelete(id).exec();
    return true;
  }
}
