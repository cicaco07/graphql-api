import { Test, TestingModule } from '@nestjs/testing';
import { SkillResolver } from './skill.resolver';
import { SkillService } from './skill.service';
import { CreateSkillInput } from './dto/create-skill.input';
import { UpdateSkillInput } from './dto/update-skill.input';

describe('SkillResolver', () => {
  let resolver: SkillResolver;
  let service: SkillService;

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

  const mockSkillService = {
    create: jest.fn(),
    addSkillToHero: jest.fn(),
    updateHeroWithSkills: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillResolver,
        {
          provide: SkillService,
          useValue: mockSkillService,
        },
      ],
    }).compile();

    resolver = module.get<SkillResolver>(SkillResolver);
    service = module.get<SkillService>(SkillService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createSkill', () => {
    it('should create a skill', async () => {
      const createSkillInput: CreateSkillInput = {
        name: 'Test Skill',
        type: 'Active',
        tag: ['Damage'],
        skill_icon: 'test-icon.png',
        lite_description: 'Test Lite Description',
        full_description: 'Test Full Description',
      };

      mockSkillService.create.mockResolvedValue(mockSkill);

      const result = await resolver.createSkill(createSkillInput);

      expect(service.create).toHaveBeenCalledWith(createSkillInput);
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

      mockSkillService.addSkillToHero.mockResolvedValue(mockSkill);

      const result = await resolver.addSkillToHero(
        mockHeroId,
        createSkillInput,
      );

      expect(service.addSkillToHero).toHaveBeenCalledWith(
        mockHeroId,
        createSkillInput,
      );
      expect(result).toEqual(mockSkill);
    });
  });

  describe('updateHeroWithSkills', () => {
    it('should update hero with skills', async () => {
      const createSkillInput: CreateSkillInput = {
        name: 'Updated Skill',
        type: 'Active',
        tag: ['Damage'],
        skill_icon: 'test-icon.png',
        lite_description: 'Updated Lite Description',
        full_description: 'Updated Full Description',
      };

      mockSkillService.updateHeroWithSkills.mockResolvedValue(mockSkill);

      const result = await resolver.updateHeroWithSkills(
        mockHeroId,
        mockHeroId2,
        mockSkillId,
        createSkillInput,
      );

      expect(service.updateHeroWithSkills).toHaveBeenCalledWith(
        mockHeroId,
        mockHeroId2,
        mockSkillId,
        createSkillInput,
      );
      expect(result).toEqual(mockSkill);
    });
  });

  describe('findAll', () => {
    it('should return an array of skills', async () => {
      const mockSkills = [mockSkill];
      mockSkillService.findAll.mockResolvedValue(mockSkills);

      const result = await resolver.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockSkills);
    });
  });

  describe('findById', () => {
    it('should return a skill by id', async () => {
      mockSkillService.findById.mockResolvedValue(mockSkill);

      const result = await resolver.findById(mockSkillId);

      expect(service.findById).toHaveBeenCalledWith(mockSkillId);
      expect(result).toEqual(mockSkill);
    });
  });

  describe('updateSkill', () => {
    it('should update a skill', async () => {
      const updateSkillInput: UpdateSkillInput = {
        name: 'Updated Skill',
      };

      const updatedSkill = { ...mockSkill, ...updateSkillInput };
      mockSkillService.update.mockResolvedValue(updatedSkill);

      const result = await resolver.updateSkill(mockSkillId, updateSkillInput);

      expect(service.update).toHaveBeenCalledWith(
        mockSkillId,
        updateSkillInput,
      );
      expect(result).toEqual(updatedSkill);
    });
  });

  describe('removeSkill', () => {
    it('should remove a skill', async () => {
      mockSkillService.remove.mockResolvedValue(mockSkill);

      const result = await resolver.removeSkill(mockSkillId);

      expect(service.remove).toHaveBeenCalledWith(mockSkillId);
      expect(result).toEqual(mockSkill);
    });
  });
});
