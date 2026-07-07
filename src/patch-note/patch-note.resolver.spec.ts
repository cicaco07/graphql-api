import { Test, TestingModule } from '@nestjs/testing';
import { PatchNoteResolver } from './patch-note.resolver';
import { PatchNoteService } from './patch-note.service';
import { PatchNoteImporterService } from './services/patch-note-importer.service';

describe('PatchNoteResolver', () => {
  let resolver: PatchNoteResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatchNoteResolver,
        { provide: PatchNoteService, useValue: {} },
        { provide: PatchNoteImporterService, useValue: {} },
      ],
    }).compile();

    resolver = module.get<PatchNoteResolver>(PatchNoteResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
