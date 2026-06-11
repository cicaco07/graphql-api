import { Test, TestingModule } from '@nestjs/testing';
import { HeroService } from './hero.service';
import { Hero } from './schemas/hero.schema';
import { Skill } from '../skill/schemas/skill.schema';
import { SkillDetail } from '../skill-detail/schemas/skill-detail.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHeroInput } from './dto/create-hero.input';
import { UpdateHeroInput } from './dto/update-hero.input';
import { NotFoundException } from '@nestjs/common';

describe('HeroService', () => {
  let service: HeroService;
  let heroModel: Model<Hero>;
  let skillModel: Model<Skill>;
  let skillDetailModel: Model<SkillDetail>;

  const mockHeroId = '507f1f77bcf86cd799439011';
  const mockSkillId = '507f1f77bcf86cd799439012';
  const mockSkillDetailId = '507f1f77bcf86cd799439013';

  const mockHero = {
    _id: mockHeroId,
    name: 'Test Hero',
    alias: 'Test Alias',
    role: ['Warrior'],
    type: ['Melee'],
    speciality: 'Test Speciality',
    region: 'Test Region',
    avatar: 'test-avatar.png',
    image: 'test-image.png',
    short_description: 'Test description',
    release_date: '2024-01-01',
    durability: 100,
    offense: 80,
    control_effect: 50,
    difficulty: 3,
    hero_order: 1,
    skills: [],
    save: jest.fn().mockResolvedValue(this),
  };

  const mockSkill = {
    _id: mockSkillId,
    name: 'Test Skill',
    hero: mockHeroId,
    skills_detail: [],
    set: jest.fn(),
    save: jest.fn().mockResolvedValue(this),
  };

  const mockSkillDetail = {
    _id: mockSkillDetailId,
    description: 'Test Detail',
    skill: mockSkillId,
  };

  const mockHeroModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockSkillModel = {
    create: jest.fn(),
    deleteMany: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockSkillDetailModel = {
    create: jest.fn(),
    deleteMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HeroService,
        {
          provide: getModelToken(Hero.name),
          useValue: mockHeroModel,
        },
        {
          provide: getModelToken(Skill.name),
          useValue: mockSkillModel,
        },
        {
          provide: getModelToken(SkillDetail.name),
          useValue: mockSkillDetailModel,
        },
      ],
    }).compile();

    service = module.get<HeroService>(HeroService);
    heroModel = module.get<Model<Hero>>(getModelToken(Hero.name));
    skillModel = module.get<Model<Skill>>(getModelToken(Skill.name));
    skillDetailModel = module.get<Model<SkillDetail>>(
      getModelToken(SkillDetail.name),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a hero', async () => {
      const createHeroInput: CreateHeroInput = {
        name: 'Test Hero',
        alias: 'Test Alias',
        role: ['Warrior'],
        type: ['Melee'],
        speciality: 'Test Speciality',
        region: 'Test Region',
        avatar: 'test-avatar.png',
        image: 'test-image.png',
        short_description: 'Test description',
        release_date: '2024-01-01',
        durability: 100,
        offense: 80,
        control_effect: 50,
        difficulty: 3,
        hero_order: 1,
      };

      mockHeroModel.create.mockResolvedValue(mockHero);

      const result = await service.create(createHeroInput);

      expect(heroModel.create).toHaveBeenCalledWith(createHeroInput);
      expect(result).toEqual(mockHero);
    });
  });

  describe('createHeroWithSkill', () => {
    it('should create hero with skills', async () => {
      const createHeroInput: CreateHeroInput = {
        name: 'Test Hero',
        alias: 'Test Alias',
        role: ['Warrior'],
        type: ['Melee'],
        speciality: 'Test Speciality',
        region: 'Test Region',
        avatar: 'test-avatar.png',
        image: 'test-image.png',
        short_description: 'Test description',
        release_date: '2024-01-01',
        durability: 100,
        offense: 80,
        control_effect: 50,
        difficulty: 3,
        hero_order: 1,
        skills: [
          {
            name: 'Test Skill',
            type: 'Active',
            tag: ['Damage'],
            skill_icon: 'test-icon.png',
            lite_description: 'Test Lite Description',
            full_description: 'Test Full Description',
          },
        ],
      };

      const createdHero = {
        ...mockHero,
        _id: mockHeroId,
        skills: [],
        save: jest.fn().mockResolvedValue(mockHero),
      };

      mockHeroModel.create.mockResolvedValue(createdHero);
      mockSkillModel.create.mockResolvedValue(mockSkill);

      jest.spyOn(service, 'findById').mockResolvedValue(mockHero as any);

      const result = await service.createHeroWithSkill(createHeroInput);

      expect(heroModel.create).toHaveBeenCalled();
      expect(skillModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockHero);
    });
  });

  describe('createHeroWithSkillandSkillDetail', () => {
    it('should create hero with skills and skill details', async () => {
      const createHeroInput: CreateHeroInput = {
        name: 'Test Hero',
        alias: 'Test Alias',
        role: ['Warrior'],
        type: ['Melee'],
        speciality: 'Test Speciality',
        region: 'Test Region',
        avatar: 'test-avatar.png',
        image: 'test-image.png',
        short_description: 'Test description',
        release_date: '2024-01-01',
        durability: 100,
        offense: 80,
        control_effect: 50,
        difficulty: 3,
        hero_order: 1,
        skills: [
          {
            name: 'Test Skill',
            type: 'Active',
            tag: ['Damage'],
            skill_icon: 'test-icon.png',
            lite_description: 'Test Lite Description',
            full_description: 'Test Full Description',
            skills_detail: [
              {
                level: 1,
                attributes: { damage: 100 },
              },
            ],
          },
        ],
      };

      const createdHero = {
        ...mockHero,
        _id: mockHeroId,
        skills: [],
        save: jest.fn().mockResolvedValue(mockHero),
      };

      const createdSkill = {
        ...mockSkill,
        set: jest.fn(),
        save: jest.fn().mockResolvedValue(mockSkill),
      };

      mockHeroModel.create.mockResolvedValue(createdHero);
      mockSkillModel.create.mockResolvedValue(createdSkill);
      mockSkillDetailModel.create.mockResolvedValue(mockSkillDetail);

      jest.spyOn(service, 'findById').mockResolvedValue(mockHero as any);

      const result =
        await service.createHeroWithSkillandSkillDetail(createHeroInput);

      expect(heroModel.create).toHaveBeenCalled();
      expect(skillModel.create).toHaveBeenCalled();
      expect(skillDetailModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockHero);
    });
  });

  describe('findAll', () => {
    it('should return an array of heroes', async () => {
      const mockHeroes = [mockHero];

      mockHeroModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockHeroes),
      });

      const result = await service.findAll();

      expect(heroModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockHeroes);
    });
  });

  describe('findById', () => {
    it('should return a hero by id', async () => {
      mockHeroModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockHero),
      });

      const result = await service.findById(mockHeroId);

      expect(heroModel.findById).toHaveBeenCalledWith(mockHeroId);
      expect(result).toEqual(mockHero);
    });

    it('should throw NotFoundException if hero not found', async () => {
      mockHeroModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByName', () => {
    it('should return heroes by name', async () => {
      const mockHeroes = [mockHero];

      mockHeroModel.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockHeroes),
      });

      const result = await service.findByName('Test');

      expect(heroModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockHeroes);
    });

    it('should throw NotFoundException if no heroes found', async () => {
      mockHeroModel.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([]),
      });

      await expect(service.findByName('NonExistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return a hero', async () => {
      const updateHeroInput: UpdateHeroInput = {
        name: 'Updated Hero',
      };

      const updatedHero = { ...mockHero, ...updateHeroInput };

      mockHeroModel.findByIdAndUpdate.mockResolvedValue(updatedHero);

      const result = await service.update(mockHeroId, updateHeroInput);

      expect(heroModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockHeroId,
        updateHeroInput,
        { new: true },
      );
      expect(result).toEqual(updatedHero);
    });

    it('should throw NotFoundException if hero not found', async () => {
      mockHeroModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        service.update('invalid-id', { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete hero and related skills and skill details', async () => {
      const heroWithSkills = {
        ...mockHero,
        skills: [mockSkill],
      };

      mockHeroModel.findByIdAndDelete.mockReturnValue({
        populate: jest.fn().mockResolvedValue(heroWithSkills),
      });

      mockSkillModel.deleteMany.mockResolvedValue({ deletedCount: 1 });
      mockSkillDetailModel.deleteMany.mockResolvedValue({ deletedCount: 1 });

      const result = await service.remove(mockHeroId);

      expect(heroModel.findByIdAndDelete).toHaveBeenCalledWith(mockHeroId);
      expect(skillModel.deleteMany).toHaveBeenCalledWith({ hero: mockHeroId });
      expect(skillDetailModel.deleteMany).toHaveBeenCalled();
      expect(result).toEqual(heroWithSkills);
    });

    it('should throw NotFoundException if hero not found', async () => {
      mockHeroModel.findByIdAndDelete.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
