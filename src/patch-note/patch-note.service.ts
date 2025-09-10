import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PatchNote } from './schemas/patch-note.schema';
import { Model } from 'mongoose';
import { HeroPatchNote } from './schemas/hero-patch-note.schema';
import { BattlefieldPatchNote } from './schemas/battlefield-patch-note.schema';
import { GameModePatchNote } from './schemas/game-mode-patch-note.schema';
import { SystemPatchNote } from './schemas/system-patch-note.schema';
import { CreatePatchNoteInput } from './dto/create-patch-note.input';
import { CreateHeroPatchNoteInput } from './dto/create-hero-patch-note.input';
import { UpdatePatchNoteInput } from './dto/update-patch-note.input';
import { CreateBattlefieldPatchNoteInput } from './dto/create-battlefield-patch-note.input';
import { UpdateHeroPatchNoteInput } from './dto/update-hero-patch-note.input';
import { UpdateBattlefieldPatchNoteInput } from './dto/update-battlefield-patch-note.input';
import { UpdateSystemPatchNoteInput } from './dto/update-system-patch-note.input';
import { UpdateGameModePatchNoteInput } from './dto/update-game-mode-patch-note.input';

@Injectable()
export class PatchNoteService {
  constructor(
    @InjectModel(PatchNote.name)
    private patchNoteModel: Model<PatchNote>,
    @InjectModel(HeroPatchNote.name)
    private heroModel: Model<HeroPatchNote>,
    @InjectModel(BattlefieldPatchNote.name)
    private battlefieldModel: Model<BattlefieldPatchNote>,
    @InjectModel(GameModePatchNote.name)
    private gameModeModel: Model<GameModePatchNote>,
    @InjectModel(SystemPatchNote.name)
    private systemModel: Model<SystemPatchNote>,
  ) {}

  async createPatchNote(
    createPatchNoteInput: CreatePatchNoteInput,
  ): Promise<PatchNote> {
    const createdPatchNote = new this.patchNoteModel({
      ...createPatchNoteInput,
      season: Number(createPatchNoteInput.season),
      created_at: new Date(),
      updated_at: new Date(),
    });

    return createdPatchNote.save();
  }

  async createHeroPatchNote(
    patchNoteId: string,
    createHeroPatchNoteInput: CreateHeroPatchNoteInput,
  ): Promise<HeroPatchNote> {
    const patchNote = await this.patchNoteModel.findById(patchNoteId);
    if (!patchNote) {
      throw new NotFoundException('PatchNote not found');
    }

    const heroPatchNote = await this.heroModel.create({
      ...createHeroPatchNoteInput,
      patch_note: patchNoteId,
    });

    (patchNote.hero_changes as any[]).push(heroPatchNote._id);
    await patchNote.save();

    return heroPatchNote;
  }

  async createBattlefieldPatchNote(
    patchNoteId: string,
    createBattlefieldPatchNoteInput: CreateBattlefieldPatchNoteInput,
  ): Promise<BattlefieldPatchNote> {
    const patchNote = await this.patchNoteModel.findById(patchNoteId);
    if (!patchNote) {
      throw new NotFoundException('PatchNote not found');
    }

    const battlefieldPatchNote = await this.battlefieldModel.create({
      ...createBattlefieldPatchNoteInput,
      patch_note: patchNoteId,
    });

    (patchNote.battlefield_changes as any[]).push(battlefieldPatchNote._id);
    await patchNote.save();

    return battlefieldPatchNote;
  }

  async createSystemPatchNote(
    patchNoteId: string,
    createSystemPatchNoteInput: any,
  ): Promise<SystemPatchNote> {
    const patchNote = await this.patchNoteModel.findById(patchNoteId);
    if (!patchNote) {
      throw new NotFoundException('PatchNote not found');
    }

    const systemPatchNote = await this.systemModel.create({
      ...createSystemPatchNoteInput,
      patch_note: patchNoteId,
    });

    (patchNote.system_changes as any[]).push(systemPatchNote._id);
    await patchNote.save();

    return systemPatchNote;
  }

  async createGameModePatchNote(
    patchNoteId: string,
    createGameModePatchNoteInput: any,
  ): Promise<GameModePatchNote> {
    const patchNote = await this.patchNoteModel.findById(patchNoteId);
    if (!patchNote) {
      throw new NotFoundException('PatchNote not found');
    }

    const gameModePatchNote = await this.gameModeModel.create({
      ...createGameModePatchNoteInput,
      patch_note: patchNoteId,
    });

    (patchNote.game_mode_changes as any[]).push(gameModePatchNote._id);
    await patchNote.save();

    return gameModePatchNote;
  }

  async findAll(): Promise<PatchNote[]> {
    return this.patchNoteModel
      .find({ deleted_at: null })
      .populate('hero_changes')
      .populate('battlefield_changes')
      .populate('system_changes')
      .populate('game_mode_changes')
      .exec();
  }

  async findOne(id: string): Promise<PatchNote> {
    const patchNote = await this.patchNoteModel
      .findOne({ _id: id, deleted_at: null })
      .populate('hero_changes')
      .populate('battlefield_changes')
      .populate('system_changes')
      .populate('game_mode_changes')
      .exec();
    if (!patchNote) {
      throw new NotFoundException(`PatchNote with ID "${id}" not found`);
    }
    return patchNote;
  }

  async updatePatchNote(
    id: string,
    updatePatchNoteInput: UpdatePatchNoteInput,
  ): Promise<PatchNote> {
    const patchNote = await this.patchNoteModel.findByIdAndUpdate(
      id,
      updatePatchNoteInput,
      { new: true },
    );
    if (!patchNote) {
      throw new NotFoundException(`PatchNote with ID "${id}" not found`);
    }
    return patchNote;
  }

  async updateHeroPatchNote(
    id: string,
    updateHeroPatchNoteInput: UpdateHeroPatchNoteInput,
  ): Promise<HeroPatchNote> {
    const heroPatchNote = await this.heroModel.findByIdAndUpdate(
      id,
      updateHeroPatchNoteInput,
      { new: true },
    );
    if (!heroPatchNote) {
      throw new NotFoundException(`HeroPatchNote with ID "${id}" not found`);
    }
    return heroPatchNote;
  }

  async updateBattlefieldPatchNote(
    id: string,
    updateBattlefieldPatchNoteInput: UpdateBattlefieldPatchNoteInput,
  ): Promise<BattlefieldPatchNote> {
    const battlefieldPatchNote = await this.battlefieldModel.findByIdAndUpdate(
      id,
      updateBattlefieldPatchNoteInput,
      { new: true },
    );
    if (!battlefieldPatchNote) {
      throw new NotFoundException(
        `BattlefieldPatchNote with ID "${id}" not found`,
      );
    }
    return battlefieldPatchNote;
  }

  async updateSystemPatchNote(
    id: string,
    updateSystemPatchNoteInput: UpdateSystemPatchNoteInput,
  ): Promise<SystemPatchNote> {
    const systemPatchNote = await this.systemModel.findByIdAndUpdate(
      id,
      updateSystemPatchNoteInput,
      { new: true },
    );
    if (!systemPatchNote) {
      throw new NotFoundException(`SystemPatchNote with ID "${id}" not found`);
    }
    return systemPatchNote;
  }

  async updateGameModePatchNote(
    id: string,
    updateGameModePatchNoteInput: UpdateGameModePatchNoteInput,
  ): Promise<GameModePatchNote> {
    const gameModePatchNote = await this.gameModeModel.findByIdAndUpdate(
      id,
      updateGameModePatchNoteInput,
      { new: true },
    );
    if (!gameModePatchNote) {
      throw new NotFoundException(
        `GameModePatchNote with ID "${id}" not found`,
      );
    }
    return gameModePatchNote;
  }

  async removePatchNote(id: string): Promise<PatchNote> {
    const patchNote = await this.patchNoteModel.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true },
    );
    if (!patchNote) {
      throw new NotFoundException(`PatchNote with ID "${id}" not found`);
    }
    return patchNote;
  }

  async removeHeroPatchNote(id: string): Promise<HeroPatchNote> {
    const heroPatchNote = await this.heroModel.findByIdAndDelete(id);
    if (!heroPatchNote) {
      throw new NotFoundException(`HeroPatchNote with ID "${id}" not found`);
    }
    return heroPatchNote;
  }

  async removeBattlefieldPatchNote(id: string): Promise<BattlefieldPatchNote> {
    const battlefieldPatchNote =
      await this.battlefieldModel.findByIdAndDelete(id);
    if (!battlefieldPatchNote) {
      throw new NotFoundException(
        `BattlefieldPatchNote with ID "${id}" not found`,
      );
    }
    return battlefieldPatchNote;
  }

  async removeSystemPatchNote(id: string): Promise<SystemPatchNote> {
    const systemPatchNote = await this.systemModel.findByIdAndDelete(id);
    if (!systemPatchNote) {
      throw new NotFoundException(`SystemPatchNote with ID "${id}" not found`);
    }
    return systemPatchNote;
  }

  async removeGameModePatchNote(id: string): Promise<GameModePatchNote> {
    const gameModePatchNote = await this.gameModeModel.findByIdAndDelete(id);
    if (!gameModePatchNote) {
      throw new NotFoundException(
        `GameModePatchNote with ID "${id}" not found`,
      );
    }
    return gameModePatchNote;
  }
}
