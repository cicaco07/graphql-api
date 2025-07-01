import { Test, TestingModule } from '@nestjs/testing';
import { SkillDetailResolver } from './skill-detail.resolver';
import { SkillDetailService } from './skill-detail.service';

describe('SkillDetailResolver', () => {
  let resolver: SkillDetailResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillDetailResolver, SkillDetailService],
    }).compile();

    resolver = module.get<SkillDetailResolver>(SkillDetailResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
