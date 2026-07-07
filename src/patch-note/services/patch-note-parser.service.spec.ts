import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Hero } from 'src/hero/schemas/hero.schema';
import { Item } from 'src/item/schemas/item.schema';
import { PatchChangeType, PatchTargetType } from '../entities/patch-change.entity';
import { PatchNoteParserService } from './patch-note-parser.service';

const createModelMock = () => ({
  findOne: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(undefined),
    }),
  }),
});

describe('PatchNoteParserService', () => {
  let service: PatchNoteParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatchNoteParserService,
        { provide: getModelToken(Hero.name), useValue: createModelMock() },
        { provide: getModelToken(Item.name), useValue: createModelMock() },
      ],
    }).compile();

    service = module.get<PatchNoteParserService>(PatchNoteParserService);
  });

  it('parses hero headers, section headers, and value changes', async () => {
    const changes = await service.parse(`
[Saber] (↑)
Saber relied too much on a single burst of damage.
[Attributes] (↑)
Base HP: 2440 >> 2500
HP Growth: 180 >> 195
[Skill 1] (~)
Cooldown: 9s >> 10s
`);

    expect(changes).toHaveLength(3);
    expect(changes[0]).toMatchObject({
      target_type: PatchTargetType.HERO,
      target_name: 'Saber',
      change_type: PatchChangeType.BUFF,
      section: 'General',
    });
    expect(changes[1]).toMatchObject({
      section: 'Attributes',
    });
    expect(changes[1].details).toEqual([
      {
        field: 'Base HP',
        old_value: '2440',
        new_value: '2500',
        raw_text: 'Base HP: 2440 >> 2500',
      },
      {
        field: 'HP Growth',
        old_value: '180',
        new_value: '195',
        raw_text: 'HP Growth: 180 >> 195',
      },
    ]);
    expect(changes[2]).toMatchObject({
      section: 'Skill 1',
      details: [
        {
          field: 'Cooldown',
          old_value: '9s',
          new_value: '10s',
          raw_text: 'Cooldown: 9s >> 10s',
        },
      ],
    });
  });
});
