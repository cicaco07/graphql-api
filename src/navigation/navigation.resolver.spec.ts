import { Test, TestingModule } from '@nestjs/testing';
import { NavigationResolver } from './navigation.resolver';
import { NavigationService } from './navigation.service';

describe('NavigationResolver', () => {
  let resolver: NavigationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NavigationResolver, NavigationService],
    }).compile();

    resolver = module.get<NavigationResolver>(NavigationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
