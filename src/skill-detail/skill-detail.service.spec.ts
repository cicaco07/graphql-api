import { Test, TestingModule } from '@nestjs/testing';
import { SkillDetailService } from './skill-detail.service';
import { SkillDetail } from './schemas/skill-detail.schema';
import { Skill } from '../skill/schemas/skill.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSkillDetailInput } from './dto/create-skill-detail.input';
import { UpdateSkillDetailInput } from './dto/update-skill-detail.input';
import { NotFoundException } from '@nestjs/common';

describe('SkillDetailService', () => {
  let service: SkillDetailService;
  let skillDetailModel: Model<SkillDetail>;
  let skillModel: Model<Skill>;

  const mockSkillId = '507f1f77bcf86cd799439012';
  const mockSkillDetailId = '507f1f77bcf86cd799439013';

  const mockSkillDetail = {
    _id: mockSkillDetailId,
    level: 1,
    attributes: { damage: 100 },
    skill: mockSkillId,
  };

  const mockSkill = {
    _id: mockSkillId,
    name: 'Test Skill',
    skills_detail: [],
    save: jest.fn().mockResolvedValue(this),
  };

  const mockSkillDetailModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockSkillModel = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillDetailService,
        {
          provide: getModelToken(SkillDetail.name),
          useValue: mockSkillDetailModel,
        },
        {
          provide: getModelToken(Skill.name),
          useValue: mockSkillModel,
        },
      ],
    }).compile();

    service = module.get<SkillDetailService>(SkillDetailService);
    skillDetailModel = module.get<Model<SkillDetail>>(
      getModelToken(SkillDetail.name),
    );
    skillModel = module.get<Model<Skill>>(getModelToken(Skill.name));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a skill detail', async () => {
      const createSkillDetailInput: CreateSkillDetailInput = {
        level: 1,
        attributes: { damage: 100 },
      };

      mockSkillDetailModel.create.mockResolvedValue(mockSkillDetail);

      const result = await service.create(createSkillDetailInput);

      expect(skillDetailModel.create).toHaveBeenCalledWith(
        createSkillDetailInput,
      );
      expect(result).toEqual(mockSkillDetail);
    });
  });

  describe('addSkillDetailsToSkill', () => {
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

      const skill = {
        ...mockSkill,
        skills_detail: [],
        save: jest.fn().mockResolvedValue(mockSkill),
      };

      mockSkillModel.findById.mockResolvedValue(skill);
      mockSkillDetailModel.create.mockResolvedValue(mockSkillDetail);

      const result = await service.addSkillDetailsToSkill(
        mockSkillId,
        createSkillDetailInputs,
      );

      expect(skillModel.findById).toHaveBeenCalledWith(mockSkillId);
      expect(skillDetailModel.create).toHaveBeenCalledTimes(2);
      expect(skill.save).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should throw NotFoundException if skill not found', async () => {
      mockSkillModel.findById.mockResolvedValue(null);

      await expect(
        service.addSkillDetailsToSkill('invalid-id', []),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of skill details', async () => {
      const mockSkillDetails = [mockSkillDetail];

      mockSkillDetailModel.find.mockResolvedValue(mockSkillDetails);

      const result = await service.findAll();

      expect(skillDetailModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockSkillDetails);
    });
  });

  describe('findOne', () => {
    it('should return a skill detail by id', async () => {
      mockSkillDetailModel.findById.mockResolvedValue(mockSkillDetail);

      const result = await service.findOne(mockSkillDetailId);

      expect(skillDetailModel.findById).toHaveBeenCalledWith(mockSkillDetailId);
      expect(result).toEqual(mockSkillDetail);
    });

    it('should throw NotFoundException if skill detail not found', async () => {
      mockSkillDetailModel.findById.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return a skill detail', async () => {
      const updateSkillDetailInput: UpdateSkillDetailInput = {
        level: 2,
      };

      const updatedSkillDetail = {
        ...mockSkillDetail,
        ...updateSkillDetailInput,
      };

      mockSkillDetailModel.findByIdAndUpdate.mockResolvedValue(
        updatedSkillDetail,
      );

      const result = await service.update(
        mockSkillDetailId,
        updateSkillDetailInput,
      );

      expect(skillDetailModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockSkillDetailId,
        updateSkillDetailInput,
        { new: true },
      );
      expect(result).toEqual(updatedSkillDetail);
    });

    it('should throw NotFoundException if skill detail not found', async () => {
      mockSkillDetailModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.update('invalid-id', { level: 2 })).rejects.toThrow(
        NotFoundException,
      );
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

      mockSkillModel.findById.mockResolvedValue(mockSkill);
      mockSkillDetailModel.findById.mockResolvedValue({
        ...mockSkillDetail,
        skill: {
          toString: () => mockSkillId,
        },
      });
      mockSkillDetailModel.findByIdAndUpdate.mockResolvedValue(
        updatedSkillDetail,
      );

      const result = await service.updateSkillDetailToSkill(
        mockSkillId,
        mockSkillDetailId,
        updateSkillDetailInput,
      );

      expect(skillModel.findById).toHaveBeenCalledWith(mockSkillId);
      expect(skillDetailModel.findById).toHaveBeenCalledWith(mockSkillDetailId);
      expect(skillDetailModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockSkillDetailId,
        updateSkillDetailInput,
        { new: true },
      );
      expect(result).toEqual(updatedSkillDetail);
    });

    it('should throw NotFoundException if skill not found', async () => {
      mockSkillModel.findById.mockResolvedValue(null);

      await expect(
        service.updateSkillDetailToSkill(
          'invalid-id',
          mockSkillDetailId,
          {} as UpdateSkillDetailInput,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if skill detail not found', async () => {
      mockSkillModel.findById.mockResolvedValue(mockSkill);
      mockSkillDetailModel.findById.mockResolvedValue(null);

      await expect(
        service.updateSkillDetailToSkill(
          mockSkillId,
          'invalid-id',
          {} as UpdateSkillDetailInput,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if skill detail does not belong to skill', async () => {
      const differentSkillId = '507f1f77bcf86cd799439099';

      mockSkillModel.findById.mockResolvedValue(mockSkill);
      mockSkillDetailModel.findById.mockResolvedValue({
        ...mockSkillDetail,
        skill: {
          toString: () => differentSkillId,
        },
      });

      await expect(
        service.updateSkillDetailToSkill(
          mockSkillId,
          mockSkillDetailId,
          {} as UpdateSkillDetailInput,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete skill detail', async () => {
      mockSkillDetailModel.findByIdAndDelete.mockResolvedValue(mockSkillDetail);

      const result = await service.remove(mockSkillDetailId);

      expect(skillDetailModel.findByIdAndDelete).toHaveBeenCalledWith(
        mockSkillDetailId,
      );
      expect(result).toEqual(mockSkillDetail);
    });

    it('should throw NotFoundException if skill detail not found', async () => {
      mockSkillDetailModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
