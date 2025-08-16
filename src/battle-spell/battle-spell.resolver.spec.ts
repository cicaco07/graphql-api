import { Test, TestingModule } from '@nestjs/testing';
import { BattleSpellResolver } from './battle-spell.resolver';
import { BattleSpellService } from './battle-spell.service';

describe('BattleSpellResolver', () => {
  let resolver: BattleSpellResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BattleSpellResolver, BattleSpellService],
    }).compile();

    resolver = module.get<BattleSpellResolver>(BattleSpellResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
