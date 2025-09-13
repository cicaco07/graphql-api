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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PatchNote.name, schema: PatchNoteSchema },
      { name: HeroPatchNote.name, schema: HeroPatchNoteSchema },
      { name: BattlefieldPatchNote.name, schema: BattlefieldPatchNoteSchema },
      { name: SystemPatchNote.name, schema: SystemPatchNoteSchema },
      { name: GameModePatchNote.name, schema: GameModePatchNoteSchema },
    ]),
  ],
  providers: [PatchNoteResolver, PatchNoteService],
  exports: [PatchNoteService],
})
export class PatchNoteModule {}
