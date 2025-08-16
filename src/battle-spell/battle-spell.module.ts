import { Module } from '@nestjs/common';
import { BattleSpellService } from './battle-spell.service';
import { BattleSpellResolver } from './battle-spell.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { BattleSpell, BattleSpellSchema } from './schemas/battle-spell.schema';
import { BattleSpellController } from './battle-spell.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BattleSpell.name, schema: BattleSpellSchema },
    ]),
  ],
  controllers: [BattleSpellController],
  providers: [BattleSpellResolver, BattleSpellService],
  exports: [BattleSpellService],
})
export class BattleSpellModule {}
