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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatchNoteService,
        ...modelNames.map((name) => ({ provide: getModelToken(name), useValue: {} })),
        { provide: PatchNoteParserService, useValue: {} },
      ],
    }).compile();

    service = module.get<PatchNoteService>(PatchNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
