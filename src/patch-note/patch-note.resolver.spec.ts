import { Test, TestingModule } from '@nestjs/testing';
import { PatchNoteResolver } from './patch-note.resolver';
import { PatchNoteService } from './patch-note.service';

describe('PatchNoteResolver', () => {
  let resolver: PatchNoteResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatchNoteResolver, PatchNoteService],
    }).compile();

    resolver = module.get<PatchNoteResolver>(PatchNoteResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
