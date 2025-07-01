import { Test, TestingModule } from '@nestjs/testing';
import { SkillDetailService } from './skill-detail.service';

describe('SkillDetailService', () => {
  let service: SkillDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillDetailService],
    }).compile();

    service = module.get<SkillDetailService>(SkillDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
