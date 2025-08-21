import { Test, TestingModule } from '@nestjs/testing';
import { BaseStatResolver } from './base-stat.resolver';
import { BaseStatService } from './base-stat.service';

describe('BaseStatResolver', () => {
  let resolver: BaseStatResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseStatResolver, BaseStatService],
    }).compile();

    resolver = module.get<BaseStatResolver>(BaseStatResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
