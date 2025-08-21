import { Test, TestingModule } from '@nestjs/testing';
import { BaseStatService } from './base-stat.service';

describe('BaseStatService', () => {
  let service: BaseStatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseStatService],
    }).compile();

    service = module.get<BaseStatService>(BaseStatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
