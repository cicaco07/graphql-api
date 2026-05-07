import { Test, TestingModule } from '@nestjs/testing';
import { SkillDetailResolver } from './skill-detail.resolver';
import { SkillDetailService } from './skill-detail.service';
import { CreateSkillDetailInput } from './dto/create-skill-detail.input';
import { UpdateSkillDetailInput } from './dto/update-skill-detail.input';

describe('SkillDetailResolver', () => {
  let resolver: SkillDetailResolver;
  let service: SkillDetailService;

  const mockSkillId = '507f1f77bcf86cd799439012';
  const mockSkillDetailId = '507f1f77bcf86cd799439013';

  const mockSkillDetail = {
    _id: mockSkillDetailId,
    level: 1,
    attributes: { damage: 100 },
    skill: mockSkillId,
  };

  const mockSkillDetailService = {
    create: jest.fn(),
    addSkillDetailsToSkill: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateSkillDetailToSkill: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillDetailResolver,
        {
          provide: SkillDetailService,
          useValue: mockSkillDetailService,
        },
      ],
    }).compile();

    resolver = module.get<SkillDetailResolver>(SkillDetailResolver);
    service = module.get<SkillDetailService>(SkillDetailService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createSkillDetail', () => {
    it('should create a skill detail', async () => {
      const createSkillDetailInput: CreateSkillDetailInput = {
        level: 1,
        attributes: { damage: 100 },
      };

      mockSkillDetailService.create.mockResolvedValue(mockSkillDetail);

      const result = await resolver.createSkillDetail(createSkillDetailInput);

      expect(service.create).toHaveBeenCalledWith(createSkillDetailInput);
      expect(result).toEqual(mockSkillDetail);
    });
  });

  describe('addSkillDetailToSkill', () => {
    it('should add skill details to skill', async () => {
      const createSkillDetailInputs: CreateSkillDetailInput[] = [
        {
          level: 1,
          attributes: { damage: 100 },
        },
        {
          level: 2,
          attributes: { damage: 150 },
        },
      ];

      const mockSkillDetails = [mockSkillDetail, mockSkillDetail];

      mockSkillDetailService.addSkillDetailsToSkill.mockResolvedValue(
        mockSkillDetails,
      );

      const result = await resolver.addSkillDetailToSkill(
        mockSkillId,
        createSkillDetailInputs,
      );

      expect(service.addSkillDetailsToSkill).toHaveBeenCalledWith(
        mockSkillId,
        createSkillDetailInputs,
      );
      expect(result).toEqual(mockSkillDetails);
    });
  });

  describe('findAll', () => {
    it('should return an array of skill details', async () => {
      const mockSkillDetails = [mockSkillDetail];
      mockSkillDetailService.findAll.mockResolvedValue(mockSkillDetails);

      const result = await resolver.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockSkillDetails);
    });
  });

  describe('findOne', () => {
    it('should return a skill detail by id', async () => {
      mockSkillDetailService.findOne.mockResolvedValue(mockSkillDetail);

      const result = await resolver.findOne(mockSkillDetailId);

      expect(service.findOne).toHaveBeenCalledWith(mockSkillDetailId);
      expect(result).toEqual(mockSkillDetail);
    });
  });

  describe('updateSkillDetail', () => {
    it('should update a skill detail', async () => {
      const updateSkillDetailInput: UpdateSkillDetailInput = {
        level: 2,
      };

      const updatedSkillDetail = {
        ...mockSkillDetail,
        ...updateSkillDetailInput,
      };
      mockSkillDetailService.update.mockResolvedValue(updatedSkillDetail);

      const result = await resolver.updateSkillDetail(
        mockSkillDetailId,
        updateSkillDetailInput,
      );

      expect(service.update).toHaveBeenCalledWith(
        mockSkillDetailId,
        updateSkillDetailInput,
      );
      expect(result).toEqual(updatedSkillDetail);
    });
  });

  describe('updateSkillDetailToSkill', () => {
    it('should update skill detail belonging to skill', async () => {
      const updateSkillDetailInput: UpdateSkillDetailInput = {
        level: 2,
      };

      const updatedSkillDetail = {
        ...mockSkillDetail,
        ...updateSkillDetailInput,
      };
      mockSkillDetailService.updateSkillDetailToSkill.mockResolvedValue(
        updatedSkillDetail,
      );

      const result = await resolver.updateSkillDetailToSkill(
        mockSkillId,
        mockSkillDetailId,
        updateSkillDetailInput,
      );

      expect(service.updateSkillDetailToSkill).toHaveBeenCalledWith(
        mockSkillId,
        mockSkillDetailId,
        updateSkillDetailInput,
      );
      expect(result).toEqual(updatedSkillDetail);
    });
  });

  describe('removeSkillDetail', () => {
    it('should remove a skill detail', async () => {
      mockSkillDetailService.remove.mockResolvedValue(mockSkillDetail);

      const result = await resolver.removeSkillDetail(mockSkillDetailId);

      expect(service.remove).toHaveBeenCalledWith(mockSkillDetailId);
      expect(result).toEqual(mockSkillDetail);
    });
  });
});
