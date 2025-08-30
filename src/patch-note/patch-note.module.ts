import { Module } from '@nestjs/common';
import { PatchNoteService } from './patch-note.service';
import { PatchNoteResolver } from './patch-note.resolver';

@Module({
  providers: [PatchNoteResolver, PatchNoteService],
})
export class PatchNoteModule {}
