import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Build } from './schemas/build.schema';
import { Hero } from 'src/hero/schemas/hero.schema';
import { Item } from 'src/item/schemas/item.schema';
import { Emblem } from 'src/emblem/schemas/emblem.schema';
import { BattleSpell } from 'src/battle-spell/schemas/battle-spell.schema';
import { CreateBuildInput } from './dto/create-build.input';
import { User } from 'src/auth/schemas/user.schema';
// import { BuildRating } from './entities/build.entity';

@Injectable()
export class BuildService {
  private readonly logger = new Logger(BuildService.name);

  constructor(
    @InjectModel(Build.name) private buildModel: Model<Build>,
    @InjectModel(Hero.name) private heroModel: Model<Hero>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Item.name) private itemModel: Model<Item>,
    @InjectModel(Emblem.name) private emblemModel: Model<Emblem>,
    @InjectModel(BattleSpell.name) private battleSpellModel: Model<BattleSpell>,
  ) {}

  async create(
    createBuildInput: CreateBuildInput,
    userId: string,
    userRole: string,
  ): Promise<Build> {
    const hero = await this.heroModel.findById(createBuildInput.heroId);
    if (!hero) {
      throw new NotFoundException(
        `Hero with ID ${createBuildInput.heroId} not found`,
      );
    }

    const itemIds = createBuildInput.items.map((item) => item.itemId);
    const items = await this.itemModel.find({ _id: { $in: itemIds } });
    if (items.length !== itemIds.length) {
      const foundItemIds = items
        .map((item) => item._id?.toString() || '')
        .filter((id) => id !== '');
      const missingItemIds = itemIds.filter((id) => !foundItemIds.includes(id));
      throw new NotFoundException(
        `Items not found: ${missingItemIds.join(', ')}`,
      );
    }

    const emblems = await this.emblemModel.find({
      _id: { $in: createBuildInput.emblemIds },
    });
    if (emblems.length !== createBuildInput.emblemIds.length) {
      const foundEmblemIds = emblems
        .map((emblem) => emblem._id?.toString() || '')
        .filter((id) => id !== '');
      const missingEmblemIds = createBuildInput.emblemIds.filter(
        (id) => !foundEmblemIds.includes(id),
      );
      throw new NotFoundException(
        `Emblems not found: ${missingEmblemIds.join(', ')}`,
      );
    }

    const battleSpells = await this.battleSpellModel.find({
      _id: { $in: createBuildInput.battleSpellIds },
    });
    if (battleSpells.length !== createBuildInput.battleSpellIds.length) {
      const foundSpellIds = battleSpells
        .map((spell) => spell._id?.toString() || '')
        .filter((id) => id !== '');
      const missingSpellIds = createBuildInput.battleSpellIds.filter(
        (id) => !foundSpellIds.includes(id),
      );
      throw new NotFoundException(
        `Battle spells not found: ${missingSpellIds.join(', ')}`,
      );
    }

    const orders = createBuildInput.items.map((item) => item.order);
    const uniqueOrders = [...new Set(orders)];
    if (orders.length !== uniqueOrders.length) {
      throw new BadRequestException('Item orders must be unique');
    }

    const sortedOrders = orders.sort((a, b) => a - b);
    for (let i = 0; i < sortedOrders.length; i++) {
      if (sortedOrders[i] !== i + 1) {
        throw new BadRequestException(
          'Item orders must be sequential starting from 1',
        );
      }
    }

    const buildItems = createBuildInput.items.map((item) => ({
      item: item.itemId,
      order: item.order,
    }));

    const build = new this.buildModel({
      name: createBuildInput.name,
      role: createBuildInput.role,
      description: createBuildInput.description,
      hero: createBuildInput.heroId,
      items: buildItems,
      emblems: createBuildInput.emblemIds,
      battle_spells: createBuildInput.battleSpellIds,
      user: userId,
      is_official: userRole === 'super_admin',
    });

    await build.save();
    return this.findOne(build._id.toString());
  }

  async findAll(): Promise<Build[]> {
    return await this.buildModel
      .find()
      .populate('hero')
      .populate('user')
      .populate('items.item')
      .populate('emblems')
      .populate('battle_spells')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Build> {
    const build = await this.buildModel
      .findById(id)
      .populate('hero')
      .populate('user')
      .populate('items.item')
      .populate('emblems')
      .populate('battle_spells')
      .exec();

    if (!build) {
      throw new NotFoundException(`Build with ID ${id} not found`);
    }

    return build;
  }

  async findByHero(heroId: string, limit = 10, offset = 0): Promise<Build[]> {
    const hero = await this.heroModel.findById(heroId);
    if (!hero) {
      throw new NotFoundException(`Hero with ID ${heroId} not found`);
    }

    return await this.buildModel
      .find({ hero: heroId })
      .populate('hero')
      .populate('user')
      .populate('items.item')
      .populate('emblems')
      .populate('battle_spells')
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec();
  }

  // async findPopular(limit = 10, offset = 0): Promise<Build[]> {
  //   return await this.buildModel
  //     .find({ totalRatings: { $gte: 5 } })
  //     .populate('hero')
  //     .populate('user')
  //     .populate('items.item')
  //     .populate('emblems')
  //     .populate('battle_spells')
  //     .sort({ rating: -1, totalRatings: -1 })
  //     .limit(limit)
  //     .skip(offset)
  //     .exec();
  // }

  async findByUser(userId: string, limit = 10, offset = 0): Promise<Build[]> {
    const isValidObjectId = Types.ObjectId.isValid(userId);

    if (!isValidObjectId) {
      throw new BadRequestException(`Invalid user ID format: ${userId}`);
    }

    const userObjectId = new Types.ObjectId(userId);
    const builds = await this.buildModel
      .find({ user: userObjectId })
      .populate('hero')
      .populate('user')
      .populate('items.item')
      .populate('emblems')
      .populate('battle_spells')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec();

    return builds;
  }

  async findMyBuilds(userId: string, limit = 10, offset = 0): Promise<Build[]> {
    const isValidObjectId = Types.ObjectId.isValid(userId);
    if (!isValidObjectId) {
      throw new BadRequestException(`Invalid user ID format: ${userId}`);
    }

    const userObjectId = new Types.ObjectId(userId);

    const builds = await this.buildModel
      .find({ user: userObjectId })
      .populate('hero')
      .populate('user')
      .populate('items.item')
      .populate('emblems')
      .populate('battle_spells')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec();

    this.logger.log(`Found ${builds.length} builds for current user`);
    return builds;
  }

  async findOfficial(limit = 10, offset = 0): Promise<Build[]> {
    return await this.buildModel
      .find({ is_official: true })
      .populate('hero')
      .populate('user')
      .populate('items.item')
      .populate('emblems')
      .populate('battle_spells')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const build = await this.buildModel.findById(id).populate('user');
    if (!build) {
      throw new NotFoundException(`Build with ID ${id} not found`);
    }

    if (build.is_official) {
      throw new ForbiddenException('Official builds cannot be deleted');
    }

    await this.buildModel.findByIdAndDelete(id);
    return true;
  }

  // async rateBuild(
  //   buildId: string,
  //   rating: number,
  //   userId: string,
  // ): Promise<Build> {
  //   const build = await this.buildModel.findById(buildId);

  //   if (!build) {
  //     throw new NotFoundException(`Build with ID ${buildId} not found`);
  //   }

  //   // Cek apakah user sudah pernah rating
  //   const existingRatingIndex = build.ratings.findIndex(
  //     (r) => r.userId.toString() === userId,
  //   );

  //   if (existingRatingIndex >= 0) {
  //     // Update rating yang sudah ada
  //     build.ratings[existingRatingIndex].rating = rating;
  //   } else {
  //     // Tambah rating baru
  //     build.ratings.push({
  //       userId,
  //       rating,
  //       createdAt: new Date(),
  //     } as BuildRating);
  //   }

  //   // Update rata-rata rating
  //   if ('updateRating' in build && typeof build.updateRating === 'function') {
  //     (build.updateRating as Function)();
  //   }
  //   await build.save();

  //   return this.findOne(build._id);
  // }
}
