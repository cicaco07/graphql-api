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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Build.name, schema: BuildSchema },
      { name: Hero.name, schema: HeroSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Emblem.name, schema: EmblemSchema },
      { name: BattleSpell.name, schema: BattleSpellSchema },
    ]),
  ],
  providers: [SeederService, UserSeeder, BuildSeeder],
  exports: [SeederService, UserSeeder, BuildSeeder],
})
export class DatabaseModule {}
