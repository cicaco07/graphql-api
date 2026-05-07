import { Test, TestingModule } from '@nestjs/testing';
import { SkillService } from './skill.service';
import { Skill } from './schemas/skill.schema';
import { Hero } from '../hero/schemas/hero.schema';
import { SkillDetail } from '../skill-detail/schemas/skill-detail.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';
import { NotFoundException } from '@nestjs/common';

describe('SkillService', () => {
  let service: SkillService;
  let skillModel: Model<Skill>;
  let heroModel: Model<Hero>;
  let skillDetailModel: Model<SkillDetail>;

  const mockHeroId = '507f1f77bcf86cd799439011';
  const mockSkillId = '507f1f77bcf86cd799439012';
  const mockHeroId2 = '507f1f77bcf86cd799439014';

  const mockSkill = {
    _id: mockSkillId,
    name: 'Test Skill',
    type: 'Active',
    tag: ['Damage'],
    skill_icon: 'test-icon.png',
    lite_description: 'Test Lite Description',
    full_description: 'Test Full Description',
    hero: mockHeroId,
    skills_detail: [],
  };

  const mockHero = {
    _id: mockHeroId,
    name: 'Test Hero',
    skills: [],
    save: jest.fn().mockResolvedValue(this),
  };

  const mockSkillModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockHeroModel = {
    findById: jest.fn(),
  };

  const mockSkillDetailModel = {
    deleteMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillService,
        {
          provide: getModelToken(Skill.name),
          useValue: mockSkillModel,
        },
        {
          provide: getModelToken(Hero.name),
          useValue: mockHeroModel,
        },
        {
          provide: getModelToken(SkillDetail.name),
          useValue: mockSkillDetailModel,
        },
      ],
    }).compile();

    service = module.get<SkillService>(SkillService);
    skillModel = module.get<Model<Skill>>(getModelToken(Skill.name));
    heroModel = module.get<Model<Hero>>(getModelToken(Hero.name));
    skillDetailModel = module.get<Model<SkillDetail>>(
      getModelToken(SkillDetail.name),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a skill', async () => {
      const createSkillInput: CreateSkillInput = {
        name: 'Test Skill',
        type: 'Active',
        tag: ['Damage'],
        skill_icon: 'test-icon.png',
        lite_description: 'Test Lite Description',
        full_description: 'Test Full Description',
      };

      mockSkillModel.create.mockResolvedValue(mockSkill);

      const result = await service.create(createSkillInput);

      expect(skillModel.create).toHaveBeenCalledWith(createSkillInput);
      expect(result).toEqual(mockSkill);
    });
  });

  describe('addSkillToHero', () => {
    it('should add skill to hero', async () => {
      const createSkillInput: CreateSkillInput = {
        name: 'Test Skill',
        type: 'Active',
        tag: ['Damage'],
        skill_icon: 'test-icon.png',
        lite_description: 'Test Lite Description',
        full_description: 'Test Full Description',
      };

      const hero = {
        ...mockHero,
        skills: [],
        save: jest.fn().mockResolvedValue(mockHero),
      };

      mockHeroModel.findById.mockResolvedValue(hero);
      mockSkillModel.create.mockResolvedValue(mockSkill);

      const result = await service.addSkillToHero(mockHeroId, createSkillInput);

      expect(heroModel.findById).toHaveBeenCalledWith(mockHeroId);
      expect(skillModel.create).toHaveBeenCalledWith({
        ...createSkillInput,
        hero: mockHeroId,
      });
      expect(hero.save).toHaveBeenCalled();
      expect(result).toEqual(mockSkill);
    });

    it('should throw NotFoundException if hero not found', async () => {
      mockHeroModel.findById.mockResolvedValue(null);

      await expect(
        service.addSkillToHero('invalid-id', {} as CreateSkillInput),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateHeroWithSkills', () => {
    it('should update skill when moving to same hero', async () => {
      const updateInput: CreateSkillInput = {
        name: 'Updated Skill',
        type: 'Active',
        tag: ['Damage'],
        skill_icon: 'test-icon.png',
        lite_description: 'Updated Lite Description',
        full_description: 'Updated Full Description',
      };

      const hero = {
        ...mockHero,
        _id: mockHeroId,
      };

      mockHeroModel.findById.mockResolvedValue(hero);
      mockSkillModel.findById.mockResolvedValue(mockSkill);
      mockSkillModel.findByIdAndUpdate.mockResolvedValue({
        ...mockSkill,
        ...updateInput,
      });

      const result = await service.updateHeroWithSkills(
        mockHeroId,
        mockHeroId,
        mockSkillId,
        updateInput,
      );

      expect(heroModel.findById).toHaveBeenCalledWith(mockHeroId);
      expect(skillModel.findById).toHaveBeenCalledWith(mockSkillId);
      expect(skillModel.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should move skill to different hero', async () => {
      const updateInput: CreateSkillInput = {
        name: 'Updated Skill',
        type: 'Active',
        tag: ['Damage'],
        skill_icon: 'test-icon.png',
        lite_description: 'Updated Lite Description',
        full_description: 'Updated Full Description',
      };

      const fromHero = {
        ...mockHero,
        _id: mockHeroId,
      };

      const toHero = {
        ...mockHero,
        _id: mockHeroId2,
        skills: [],
        save: jest.fn().mockResolvedValue(mockHero),
      };

      mockHeroModel.findById
        .mockResolvedValueOnce(fromHero)
        .mockResolvedValueOnce(toHero)
        .mockResolvedValueOnce(toHero);

      mockSkillModel.findById.mockResolvedValue(mockSkill);
      mockSkillModel.findByIdAndDelete.mockResolvedValue(mockSkill);
      mockSkillDetailModel.deleteMany.mockResolvedValue({ deletedCount: 0 });
      mockSkillModel.create.mockResolvedValue(mockSkill);

      const result = await service.updateHeroWithSkills(
        mockHeroId,
        mockHeroId2,
        mockSkillId,
        updateInput,
      );

      expect(heroModel.findById).toHaveBeenCalledWith(mockHeroId);
      expect(heroModel.findById).toHaveBeenCalledWith(mockHeroId2);
      expect(skillModel.findByIdAndDelete).toHaveBeenCalledWith(mockSkillId);
      expect(skillModel.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if from hero not found', async () => {
      mockHeroModel.findById.mockResolvedValue(null);

      await expect(
        service.updateHeroWithSkills(
          'invalid-id',
          mockHeroId2,
          mockSkillId,
          {} as CreateSkillInput,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if to hero not found', async () => {
      mockHeroModel.findById
        .mockResolvedValueOnce(mockHero)
        .mockResolvedValueOnce(null);

      await expect(
        service.updateHeroWithSkills(
          mockHeroId,
          'invalid-id',
          mockSkillId,
          {} as CreateSkillInput,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if skill not found', async () => {
      mockHeroModel.findById.mockResolvedValue(mockHero);
      mockSkillModel.findById.mockResolvedValue(null);

      await expect(
        service.updateHeroWithSkills(
          mockHeroId,
          mockHeroId2,
          'invalid-id',
          {} as CreateSkillInput,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of skills', async () => {
      const mockSkills = [mockSkill];

      mockSkillModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockSkills),
      });

      const result = await service.findAll();

      expect(skillModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockSkills);
    });
  });

  describe('findById', () => {
    it('should return a skill by id', async () => {
      mockSkillModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockSkill),
      });

      const result = await service.findById(mockSkillId);

      expect(skillModel.findById).toHaveBeenCalledWith(mockSkillId);
      expect(result).toEqual(mockSkill);
    });

    it('should throw NotFoundException if skill not found', async () => {
      mockSkillModel.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return a skill', async () => {
      const updateSkillInput: UpdateSkillInput = {
        name: 'Updated Skill',
      };

      const updatedSkill = { ...mockSkill, ...updateSkillInput };

      mockSkillModel.findByIdAndUpdate.mockResolvedValue(updatedSkill);

      const result = await service.update(mockSkillId, updateSkillInput);

      expect(skillModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockSkillId,
        updateSkillInput,
        { new: true },
      );
      expect(result).toEqual(updatedSkill);
    });

    it('should throw NotFoundException if skill not found', async () => {
      mockSkillModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete skill and related skill details', async () => {
      mockSkillDetailModel.deleteMany.mockResolvedValue({ deletedCount: 1 });
      mockSkillModel.findByIdAndDelete.mockResolvedValue(mockSkill);

      const result = await service.remove(mockSkillId);

      expect(skillDetailModel.deleteMany).toHaveBeenCalledWith({
        skill: mockSkillId,
      });
      expect(skillModel.findByIdAndDelete).toHaveBeenCalledWith(mockSkillId);
      expect(result).toEqual(mockSkill);
    });

    it('should throw NotFoundException if skill not found', async () => {
      mockSkillDetailModel.deleteMany.mockResolvedValue({ deletedCount: 0 });
      mockSkillModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
