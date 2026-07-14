import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { PatchNoteService } from './patch-note.service';
import { BattlefieldPatchNote } from './schemas/battlefield-patch-note.schema';
import { GameModePatchNote } from './schemas/game-mode-patch-note.schema';
import { HeroPatchNote } from './schemas/hero-patch-note.schema';
import { PatchChange } from './schemas/patch-change.schema';
import { PatchNote } from './schemas/patch-note.schema';
import { SystemPatchNote } from './schemas/system-patch-note.schema';
import { Hero } from 'src/hero/schemas/hero.schema';
import { Item } from 'src/item/schemas/item.schema';
import { PatchNoteParserService } from './services/patch-note-parser.service';
import { PatchTargetType } from './entities/patch-change.entity';

const modelNames = [
  PatchNote.name,
  HeroPatchNote.name,
  BattlefieldPatchNote.name,
  GameModePatchNote.name,
  SystemPatchNote.name,
  PatchChange.name,
  Hero.name,
  Item.name,
];

describe('PatchNoteService', () => {
  let service: PatchNoteService;
  let patchNoteModel: { findOne: jest.Mock };
  let patchChangeModel: {
    find: jest.Mock;
    deleteMany: jest.Mock;
    create: jest.Mock;
  };
  let parser: { parse: jest.Mock };

  beforeEach(async () => {
    patchNoteModel = { findOne: jest.fn() };
    patchChangeModel = {
      find: jest.fn(),
      deleteMany: jest.fn(),
      create: jest.fn(),
    };
    parser = { parse: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatchNoteService,
        ...modelNames
          .filter((name) => ![PatchNote.name, PatchChange.name].includes(name))
          .map((name) => ({ provide: getModelToken(name), useValue: {} })),
        {
          provide: getModelToken(PatchNote.name),
          useValue: patchNoteModel,
        },
        {
          provide: getModelToken(PatchChange.name),
          useValue: patchChangeModel,
        },
        { provide: PatchNoteParserService, useValue: parser },
      ],
    }).compile();

    service = module.get<PatchNoteService>(PatchNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('orders target history by patch publication date before change order', async () => {
    const olderPatch = { _id: 'older', published_at: new Date('2026-01-01') };
    const newerPatch = { _id: 'newer', published_at: new Date('2026-02-01') };
    const changes = [
      { _id: 'older-change', patch_note: olderPatch, order: 0 },
      { _id: 'newer-second', patch_note: newerPatch, order: 2 },
      { _id: 'newer-first', patch_note: newerPatch, order: 1 },
    ];
    const exec = jest.fn().mockResolvedValue(changes);
    const populate = jest.fn().mockReturnValue({ exec });
    const sort = jest.fn().mockReturnValue({ populate });
    patchChangeModel.find.mockReturnValue({ sort });

    const result = (await service.findPatchChanges({
      targetType: PatchTargetType.HERO,
      includeDrafts: true,
    })) as Array<PatchChange & { _id: string }>;

    expect(result.map((change) => String(change._id))).toEqual([
      'newer-first',
      'newer-second',
      'older-change',
    ]);
  });

  it('returns reparsed changes with populated patch note metadata', async () => {
    const patchNoteId = '507f1f77bcf86cd799439011';
    const patchNote = { _id: patchNoteId, raw_content: '[Saber] (↑)\nDamage increased.' };
    const parsedChange = {
      target_type: PatchTargetType.HERO,
      target_name: 'Saber',
      change_type: 'buff',
      section: 'General',
      description: 'Damage increased.',
      order: 0,
    };
    const populatedChange = {
      _id: 'change-id',
      ...parsedChange,
      patch_note: { _id: patchNoteId, name: 'Patch 1.0' },
    };
    patchNoteModel.findOne.mockResolvedValue(patchNote);
    patchChangeModel.deleteMany.mockResolvedValue({ deletedCount: 1 });
    parser.parse.mockResolvedValue([parsedChange]);
    patchChangeModel.create.mockResolvedValue([
      { ...populatedChange, patch_note: patchNoteId },
    ]);
    const exec = jest.fn().mockResolvedValue([populatedChange]);
    const populate = jest.fn().mockReturnValue({ exec });
    const sort = jest.fn().mockReturnValue({ populate });
    patchChangeModel.find.mockReturnValue({ sort });

    const result = await service.reparsePatchNote(patchNoteId);

    expect(result).toEqual([populatedChange]);
    expect(populate).toHaveBeenCalledWith('patch_note');
  });
});
