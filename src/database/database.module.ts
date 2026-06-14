import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/entities/user.entity';
import { Build, BuildSchema } from '../build/schemas/build.schema';
import { Hero, HeroSchema } from '../hero/schemas/hero.schema';
import { Item, ItemSchema } from '../item/schemas/item.schema';
import { Emblem, EmblemSchema } from '../emblem/schemas/emblem.schema';
import {
  BattleSpell,
  BattleSpellSchema,
} from '../battle-spell/schemas/battle-spell.schema';
import { SeederService } from './seeders/seeder.service';
import { UserSeeder } from './seeders/user.seeder';
import { BuildSeeder } from './seeders/build.seeder';
import { BaseStatSeeder } from './seeders/base-stat.seeder';
import { BaseStat, BaseStatSchema } from '../base-stat/schemas/base-stat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Build.name, schema: BuildSchema },
      { name: Hero.name, schema: HeroSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Emblem.name, schema: EmblemSchema },
      { name: BattleSpell.name, schema: BattleSpellSchema },
      { name: BaseStat.name, schema: BaseStatSchema },
    ]),
  ],
  providers: [SeederService, UserSeeder, BuildSeeder, BaseStatSeeder],
  exports: [SeederService, UserSeeder, BuildSeeder, BaseStatSeeder],
})
export class DatabaseModule {}
