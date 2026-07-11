import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PatchNote } from './schemas/patch-note.schema';
import { HeroPatchNote } from './schemas/hero-patch-note.schema';
import { BattlefieldPatchNote } from './schemas/battlefield-patch-note.schema';
import { GameModePatchNote } from './schemas/game-mode-patch-note.schema';
import { SystemPatchNote } from './schemas/system-patch-note.schema';
import { PatchChange } from './schemas/patch-change.schema';
import { Hero } from 'src/hero/schemas/hero.schema';
import { Item } from 'src/item/schemas/item.schema';
import { CreatePatchNoteInput } from './dto/create-patch-note.input';
import { CreateHeroPatchNoteInput } from './dto/create-hero-patch-note.input';
import { UpdatePatchNoteInput } from './dto/update-patch-note.input';
import { CreateBattlefieldPatchNoteInput } from './dto/create-battlefield-patch-note.input';
import { UpdateHeroPatchNoteInput } from './dto/update-hero-patch-note.input';
import { UpdateBattlefieldPatchNoteInput } from './dto/update-battlefield-patch-note.input';
import { UpdateSystemPatchNoteInput } from './dto/update-system-patch-note.input';
import { UpdateGameModePatchNoteInput } from './dto/update-game-mode-patch-note.input';
import { CreatePatchChangeInput } from './dto/create-patch-change.input';
import { UpdatePatchChangeInput } from './dto/update-patch-change.input';
import { PatchChangeFilterInput } from './dto/patch-change-filter.input';
import { PatchNoteStatus } from './entities/patch-note.entity';
import { PatchTargetType } from './entities/patch-change.entity';
import { PatchNoteParserService } from './services/patch-note-parser.service';

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
    @InjectModel(PatchChange.name)
    private patchChangeModel: Model<PatchChange>,
    @InjectModel(Hero.name)
    private heroEntityModel: Model<Hero>,
    @InjectModel(Item.name)
    private itemModel: Model<Item>,
    private patchNoteParserService: PatchNoteParserService,
  ) {}

  async createPatchNote(
    createPatchNoteInput: CreatePatchNoteInput,
    userId: string,
  ): Promise<PatchNote> {
    const { changes, ...patchNoteInput } = createPatchNoteInput;
    const createdPatchNote = new this.patchNoteModel({
      ...patchNoteInput,
      season: Number(patchNoteInput.season),
      status: patchNoteInput.status ?? PatchNoteStatus.DRAFT,
      created_by: userId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedPatchNote = await createdPatchNote.save();
    if (changes?.length) {
      await Promise.all(
        changes.map((change, index) =>
          this.createPatchChange(String((savedPatchNote as any)._id), {
            ...change,
            order: change.order ?? index,
          }),
        ),
      );
    }

    return savedPatchNote;
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

  async createPatchChange(
    patchNoteId: string,
    createPatchChangeInput: CreatePatchChangeInput,
  ): Promise<PatchChange> {
    await this.ensurePatchNoteExists(patchNoteId);
    await this.validateTargetReference(createPatchChangeInput);

    return this.patchChangeModel.create({
      ...createPatchChangeInput,
      patch_note: patchNoteId,
      order: createPatchChangeInput.order ?? 0,
    });
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

  async findPatchChanges(
    filter: PatchChangeFilterInput = {},
  ): Promise<PatchChange[]> {
    const query: Record<string, any> = { deleted_at: null };

    if (filter.patchNoteId) {
      query.patch_note = new Types.ObjectId(filter.patchNoteId);
    }
    if (filter.targetType) query.target_type = filter.targetType;
    if (filter.targetId) query.target_ref = filter.targetId;
    if (filter.targetName) query.target_name = new RegExp(`^${this.escapeRegex(filter.targetName)}$`, 'i');
    if (filter.changeType) query.change_type = filter.changeType;

    const patchNoteFilters: Record<string, any> = { deleted_at: null };
    if (!filter.includeDrafts) patchNoteFilters.status = PatchNoteStatus.PUBLISHED;
    if (filter.version) patchNoteFilters.version = filter.version;

    if (Object.keys(patchNoteFilters).length > 1 || filter.version || !filter.includeDrafts) {
      const patchIds = await this.patchNoteModel.distinct('_id', patchNoteFilters);
      query.patch_note = filter.patchNoteId
        ? filter.patchNoteId
        : { $in: patchIds };
    }

    return this.patchChangeModel
      .find(query)
      .sort({ patch_note: -1, order: 1, createdAt: 1 })
      .populate('patch_note')
      .exec();
  }

  async findHeroPatchHistory(
    heroId?: string,
    heroName?: string,
    includeDrafts = false,
  ): Promise<PatchChange[]> {
    return this.findPatchChanges({
      targetType: PatchTargetType.HERO,
      targetId: heroId,
      targetName: heroName,
      includeDrafts,
    });
  }

  async findItemPatchHistory(
    itemId?: string,
    itemName?: string,
    includeDrafts = false,
  ): Promise<PatchChange[]> {
    return this.findPatchChanges({
      targetType: PatchTargetType.ITEM,
      targetId: itemId,
      targetName: itemName,
      includeDrafts,
    });
  }

  async reparsePatchNote(id: string): Promise<PatchChange[]> {
    const patchNote = await this.patchNoteModel.findOne({
      _id: id,
      deleted_at: null,
    });
    if (!patchNote) {
      throw new NotFoundException(`PatchNote with ID "${id}" not found`);
    }
    if (!patchNote.raw_content) {
      throw new BadRequestException('PatchNote does not have raw_content to parse');
    }

    await this.patchChangeModel.deleteMany({ patch_note: id });
    const changes = await this.patchNoteParserService.parse(patchNote.raw_content);
    if (!changes.length) return [];

    return this.patchChangeModel.create(
      changes.map((change) => ({ ...change, patch_note: id })),
    );
  }

  async updatePatchNote(
    id: string,
    updatePatchNoteInput: UpdatePatchNoteInput,
    userId: string,
  ): Promise<PatchNote> {
    const patchNote = await this.patchNoteModel.findByIdAndUpdate(
      id,
      {
        ...updatePatchNoteInput,
        updated_by: userId,
        updated_at: new Date(),
      },
      { new: true },
    );
    if (!patchNote) {
      throw new NotFoundException(`PatchNote with ID "${id}" not found`);
    }
    return patchNote;
  }

  async updatePatchChange(
    id: string,
    updatePatchChangeInput: UpdatePatchChangeInput,
  ): Promise<PatchChange> {
    const currentPatchChange = await this.patchChangeModel.findById(id);
    if (!currentPatchChange) {
      throw new NotFoundException(`PatchChange with ID "${id}" not found`);
    }
    await this.validateTargetReference({
      target_type:
        updatePatchChangeInput.target_type ?? currentPatchChange.target_type,
      target_ref: updatePatchChangeInput.target_ref,
    });

    const patchChange = await this.patchChangeModel.findByIdAndUpdate(
      id,
      updatePatchChangeInput,
      { new: true },
    );
    if (!patchChange) {
      throw new NotFoundException(`PatchChange with ID "${id}" not found`);
    }
    return patchChange;
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

  async publishPatchNote(id: string, userId: string): Promise<PatchNote> {
    const patchNote = await this.patchNoteModel.findByIdAndUpdate(
      id,
      {
        status: PatchNoteStatus.PUBLISHED,
        is_active: true,
        updated_by: userId,
        updated_at: new Date(),
      },
      { new: true },
    );
    if (!patchNote) {
      throw new NotFoundException(`PatchNote with ID "${id}" not found`);
    }
    return patchNote;
  }

  async unpublishPatchNote(id: string, userId: string): Promise<PatchNote> {
    const patchNote = await this.patchNoteModel.findByIdAndUpdate(
      id,
      {
        status: PatchNoteStatus.DRAFT,
        is_active: false,
        updated_by: userId,
        updated_at: new Date(),
      },
      { new: true },
    );
    if (!patchNote) {
      throw new NotFoundException(`PatchNote with ID "${id}" not found`);
    }
    return patchNote;
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

  async removePatchChange(id: string): Promise<PatchChange> {
    const patchChange = await this.patchChangeModel.findByIdAndUpdate(
      id,
      { deleted_at: new Date() },
      { new: true },
    );
    if (!patchChange) {
      throw new NotFoundException(`PatchChange with ID "${id}" not found`);
    }
    return patchChange;
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

  private async ensurePatchNoteExists(patchNoteId: string): Promise<void> {
    const patchNote = await this.patchNoteModel.exists({
      _id: patchNoteId,
      deleted_at: null,
    });
    if (!patchNote) {
      throw new NotFoundException('PatchNote not found');
    }
  }

  private async validateTargetReference(
    input: Pick<CreatePatchChangeInput, 'target_type' | 'target_ref'>,
  ): Promise<void> {
    if (!input.target_ref) return;
    if (!Types.ObjectId.isValid(input.target_ref)) {
      throw new BadRequestException('Invalid target_ref');
    }

    if (input.target_type === PatchTargetType.HERO) {
      const hero = await this.heroEntityModel.exists({ _id: input.target_ref });
      if (!hero) throw new NotFoundException('Hero target not found');
    }

    if (input.target_type === PatchTargetType.ITEM) {
      const item = await this.itemModel.exists({ _id: input.target_ref });
      if (!item) throw new NotFoundException('Item target not found');
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
