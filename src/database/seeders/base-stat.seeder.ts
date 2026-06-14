import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseStat } from '../../base-stat/schemas/base-stat.schema';

@Injectable()
export class BaseStatSeeder {
  private readonly logger = new Logger(BaseStatSeeder.name);

  constructor(
    @InjectModel(BaseStat.name) private baseStatModel: Model<BaseStat>,
  ) {}

  async migrateNewFields(): Promise<void> {
    try {
      this.logger.log('Starting base-stat new fields migration...');

      const newFields = {
        crit_rate: 0,
        crit_damage: 0,
        physical_pen: 0,
        magical_pen: 0,
        lifesteal: 0,
        resilience: 0,
        crit_damage_reduction: 0,
        received_heal: 0,
        magic_power_growth: 0,
      };

      const result = await this.baseStatModel.updateMany(
        { crit_rate: { $exists: false } },
        { $set: newFields },
      );

      this.logger.log(
        `Migration complete: ${result.modifiedCount} base-stats updated`,
      );
      this.logger.log(
        `Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`,
      );
    } catch (error) {
      this.logger.error('Error migrating base-stat fields:', error);
      throw error;
    }
  }
}
