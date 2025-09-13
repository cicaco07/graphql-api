import { Test, TestingModule } from '@nestjs/testing';
import { PatchNoteService } from './patch-note.service';

describe('PatchNoteService', () => {
  let service: PatchNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatchNoteService],
    }).compile();

    service = module.get<PatchNoteService>(PatchNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
