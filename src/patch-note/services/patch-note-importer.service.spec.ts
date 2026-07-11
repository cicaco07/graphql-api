import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PatchNote } from '../schemas/patch-note.schema';
import { PatchChange } from '../schemas/patch-change.schema';
import { PatchNoteParserService } from './patch-note-parser.service';
import { PatchNoteImporterService } from './patch-note-importer.service';

describe('PatchNoteImporterService', () => {
  let service: PatchNoteImporterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatchNoteImporterService,
        { provide: getModelToken(PatchNote.name), useValue: {} },
        { provide: getModelToken(PatchChange.name), useValue: {} },
        { provide: PatchNoteParserService, useValue: {} },
      ],
    }).compile();

    service = module.get(PatchNoteImporterService);
  });

  it('preserves block boundaries from the official article HTML', () => {
    const html = '<div>[Saber] (↑)</div><div>[Attributes] (↑)</div><div>Base HP: 2440 &gt;&gt; 2500</div>';

    const content = (service as any).extractReadableContent(html);

    expect(content).toBe('[Saber] (↑)\n[Attributes] (↑)\nBase HP: 2440 >> 2500');
  });

  it('parses millisecond timestamps returned by GMS', () => {
    const publishedAt = (service as any).parsePublishedAt('1781683210000');

    expect(publishedAt).toEqual(new Date(1781683210000));
  });
});
