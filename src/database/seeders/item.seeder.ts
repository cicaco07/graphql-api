import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from '../../item/schemas/item.schema';
import { ItemTier } from '../../item/enums/item-tier.enum';

@Injectable()
export class ItemSeeder {
  private readonly logger = new Logger(ItemSeeder.name);

  constructor(@InjectModel(Item.name) private itemModel: Model<Item>) {}

  async migrateItemTier(): Promise<void> {
    try {
      this.logger.log('Starting item tier migration...');

      const result = await this.itemModel.updateMany(
        { tier: { $exists: false } },
        { $set: { tier: ItemTier.ETC } },
      );

      this.logger.log(
        `Migration complete: ${result.modifiedCount} items updated to tier "${ItemTier.ETC}"`,
      );
      this.logger.log(
        `Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`,
      );
    } catch (error) {
      this.logger.error('Error migrating item tier:', error);
      throw error;
    }
  }
}
