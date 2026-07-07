import { Module } from '@nestjs/common';
import { PatchNoteService } from './patch-note.service';
import { PatchNoteResolver } from './patch-note.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { PatchNote, PatchNoteSchema } from './schemas/patch-note.schema';
import {
  HeroPatchNote,
  HeroPatchNoteSchema,
} from './schemas/hero-patch-note.schema';
import {
  BattlefieldPatchNote,
  BattlefieldPatchNoteSchema,
} from './schemas/battlefield-patch-note.schema';
import {
  SystemPatchNote,
  SystemPatchNoteSchema,
} from './schemas/system-patch-note.schema';
import {
  GameModePatchNote,
  GameModePatchNoteSchema,
} from './schemas/game-mode-patch-note.schema';
import { PatchChange, PatchChangeSchema } from './schemas/patch-change.schema';
import { Hero, HeroSchema } from 'src/hero/schemas/hero.schema';
import { Item, ItemSchema } from 'src/item/schemas/item.schema';
import { PatchNoteImporterService } from './services/patch-note-importer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PatchNote.name, schema: PatchNoteSchema },
      { name: HeroPatchNote.name, schema: HeroPatchNoteSchema },
      { name: BattlefieldPatchNote.name, schema: BattlefieldPatchNoteSchema },
      { name: SystemPatchNote.name, schema: SystemPatchNoteSchema },
      { name: GameModePatchNote.name, schema: GameModePatchNoteSchema },
      { name: PatchChange.name, schema: PatchChangeSchema },
      { name: Hero.name, schema: HeroSchema },
      { name: Item.name, schema: ItemSchema },
    ]),
  ],
  providers: [PatchNoteResolver, PatchNoteService, PatchNoteImporterService],
  exports: [PatchNoteService, PatchNoteImporterService],
})
export class PatchNoteModule {}
