import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PatchNote } from '../schemas/patch-note.schema';
import { PatchChange } from '../schemas/patch-change.schema';
import { PatchNoteParserService } from './patch-note-parser.service';
import { PatchNoteImporterService } from './patch-note-importer.service';
import axios from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

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

  it('requests and returns the official Indonesian article content', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          records: [
            {
              id: 3314600,
              data: {
                title: '2.1.88 CATATAN PATCH',
                body: '<div>2. Penyesuaian Hero</div><div>[Saber] (↑)</div><div>Damage meningkat.</div>',
                start_time: '1781683210000',
              },
            },
          ],
        },
      },
    });

    const article = await service.fetchOfficialContent('3314600');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      {},
      expect.objectContaining({
        headers: expect.objectContaining({ 'X-Lang': 'id' }),
      }),
    );
    expect(article).toEqual({
      title: '2.1.88 CATATAN PATCH',
      content: '2. Penyesuaian Hero\n[Saber] (↑)\nDamage meningkat.',
      publishedAt: new Date(1781683210000),
    });
  });
});
