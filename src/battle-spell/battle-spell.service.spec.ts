import { Test, TestingModule } from '@nestjs/testing';
import { BattleSpellService } from './battle-spell.service';

describe('BattleSpellService', () => {
  let service: BattleSpellService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BattleSpellService],
    }).compile();

    service = module.get<BattleSpellService>(BattleSpellService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
