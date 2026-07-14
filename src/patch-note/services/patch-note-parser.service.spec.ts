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
      change_type: PatchChangeType.ADJUSTED,
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

  it('recovers headers from legacy raw content without line breaks', async () => {
    const changes = await service.parse(
      '[Saber] (↑)Saber relied too much on burst damage.[Attributes] (↑)Base HP: 2440 >> 2500[Skill 1] (~)Cooldown: 9s >> 10s',
    );

    expect(changes).toHaveLength(3);
    expect(changes.map((change) => change.section)).toEqual([
      'General',
      'Attributes',
      'Skill 1',
    ]);
    expect(changes[1].details?.[0]).toMatchObject({
      field: 'Base HP',
      old_value: '2440',
      new_value: '2500',
    });
  });

  it('classifies a matched item as an item target', async () => {
    const itemModel = createModelMock();
    itemModel.findOne().select().lean.mockResolvedValue({ _id: 'item-id' });
    const module = await Test.createTestingModule({
      providers: [
        PatchNoteParserService,
        { provide: getModelToken(Hero.name), useValue: createModelMock() },
        { provide: getModelToken(Item.name), useValue: itemModel },
      ],
    }).compile();
    const itemParser = module.get<PatchNoteParserService>(PatchNoteParserService);

    const changes = await itemParser.parse(
      '[Blade of Despair] (↑)\n[Attributes] (↑)\nPhysical Attack: 160 >> 170',
    );

    expect(changes[0]).toMatchObject({
      target_type: PatchTargetType.ITEM,
      target_ref: 'item-id',
      target_name: 'Blade of Despair',
    });
  });

  it('separates battlefield, system, and game mode sections from hero changes', async () => {
    const changes = await service.parse(`
[Saber] (↑)
Base HP: 2440 >> 2500
3. Battlefield Adjustment
Control targeting has been optimized for directional skills.
4. System Adjustments
Ranked season rewards have been updated for the new season.
5. Mode Adjustments
Brawl now uses the updated Necrokeep battlefield.
`);

    expect(changes).toHaveLength(4);
    expect(changes.map((change) => change.target_type)).toEqual([
      PatchTargetType.HERO,
      PatchTargetType.BATTLEFIELD,
      PatchTargetType.SYSTEM,
      PatchTargetType.GAME_MODE,
    ]);
    expect(changes.slice(1).map((change) => change.target_name)).toEqual([
      'Battlefield',
      'System',
      'Game Mode',
    ]);
  });

  it('keeps unmatched equipment targets in item history', async () => {
    const changes = await service.parse(`
Equipment Adjustments: roaming equipment has been updated.
[Roaming Blessings] (↑)
Solo Income: 50% >> 30%
`);

    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatchObject({
      target_type: PatchTargetType.ITEM,
      target_name: 'Roaming Blessings',
      change_type: PatchChangeType.BUFF,
    });
  });

  it('drops punctuation-only general fragments and keeps meaningful detail sections', async () => {
    const changes = await service.parse(`
[Argus] (↑)
,
[Attributes] (↑)
Base Attack: 111 >> 120
[Yin] (↑)
, and
[Skill 1 (Lieh Form)] (↑)
Cooldown: 20-14s >> 1.5s
`);

    expect(changes).toHaveLength(2);
    expect(changes.map((change) => ({
      target: change.target_name,
      section: change.section,
      description: change.description,
    }))).toEqual([
      {
        target: 'Argus',
        section: 'Attributes',
        description: 'Base Attack: 111 >> 120',
      },
      {
        target: 'Yin',
        section: 'Skill 1 (Lieh Form)',
        description: 'Cooldown: 20-14s >> 1.5s',
      },
    ]);
  });
});
