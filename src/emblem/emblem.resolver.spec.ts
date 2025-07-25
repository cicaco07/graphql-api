import { Test, TestingModule } from '@nestjs/testing';
import { EmblemResolver } from './emblem.resolver';
import { EmblemService } from './emblem.service';

describe('EmblemResolver', () => {
  let resolver: EmblemResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmblemResolver, EmblemService],
    }).compile();

    resolver = module.get<EmblemResolver>(EmblemResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
