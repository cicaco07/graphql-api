import { Module } from '@nestjs/common';
import { BuildService } from './build.service';
import { BuildResolver } from './build.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Build, BuildSchema } from './schemas/build.schema';
import { Hero, HeroSchema } from 'src/hero/schemas/hero.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { Item, ItemSchema } from 'src/item/schemas/item.schema';
import {
  BattleSpell,
  BattleSpellSchema,
} from 'src/battle-spell/schemas/battle-spell.schema';
import { Emblem, EmblemSchema } from 'src/emblem/schemas/emblem.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Build.name, schema: BuildSchema },
      { name: Hero.name, schema: HeroSchema },
      { name: User.name, schema: UserSchema },
      { name: Item.name, schema: ItemSchema },
      { name: BattleSpell.name, schema: BattleSpellSchema },
      { name: Emblem.name, schema: EmblemSchema },
    ]),
  ],
  providers: [BuildResolver, BuildService],
  exports: [BuildService],
})
export class BuildModule {}
