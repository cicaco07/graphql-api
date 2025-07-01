import { Test, TestingModule } from '@nestjs/testing';
import { HeroResolver } from './hero.resolver';
import { HeroService } from './hero.service';

describe('HeroResolver', () => {
  let resolver: HeroResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HeroResolver, HeroService],
    }).compile();

    resolver = module.get<HeroResolver>(HeroResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
