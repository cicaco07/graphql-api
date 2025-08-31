import { Module } from '@nestjs/common';
import { PatchNoteService } from './patch-note.service';
import { PatchNoteResolver } from './patch-note.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { PatchNote, PatchNoteSchema } from './schemas/patch-note.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PatchNote.name, schema: PatchNoteSchema },
    ]),
  ],
  providers: [PatchNoteResolver, PatchNoteService],
  exports: [PatchNoteService],
})
export class PatchNoteModule {}
