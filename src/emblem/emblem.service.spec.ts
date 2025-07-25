import { Test, TestingModule } from '@nestjs/testing';
import { EmblemService } from './emblem.service';

describe('EmblemService', () => {
  let service: EmblemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmblemService],
    }).compile();

    service = module.get<EmblemService>(EmblemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
