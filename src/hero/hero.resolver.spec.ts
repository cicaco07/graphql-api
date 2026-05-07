import { Test, TestingModule } from '@nestjs/testing';
import { HeroResolver } from './hero.resolver';
import { HeroService } from './hero.service';
import { CreateHeroInput } from './dto/create-hero.input';
import { UpdateHeroInput } from './dto/update-hero.input';

describe('HeroResolver', () => {
  let resolver: HeroResolver;
  let service: HeroService;

  const mockHeroId = '507f1f77bcf86cd799439011';

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
  };

  const mockHeroService = {
    create: jest.fn(),
    createHeroWithSkill: jest.fn(),
    createHeroWithSkillandSkillDetail: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HeroResolver,
        {
          provide: HeroService,
          useValue: mockHeroService,
        },
      ],
    }).compile();

    resolver = module.get<HeroResolver>(HeroResolver);
    service = module.get<HeroService>(HeroService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createHero', () => {
    it('should create a hero', async () => {
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

      mockHeroService.create.mockResolvedValue(mockHero);

      const result = await resolver.createHero(createHeroInput);

      expect(service.create).toHaveBeenCalledWith(createHeroInput);
      expect(result).toEqual(mockHero);
    });
  });

  describe('createHeroWithSkill', () => {
    it('should create a hero with skills', async () => {
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

      mockHeroService.createHeroWithSkill.mockResolvedValue(mockHero);

      const result = await resolver.createHeroWithSkill(createHeroInput);

      expect(service.createHeroWithSkill).toHaveBeenCalledWith(createHeroInput);
      expect(result).toEqual(mockHero);
    });
  });

  describe('createHeroWithSkillandSkillDetail', () => {
    it('should create a hero with skills and skill details', async () => {
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

      mockHeroService.createHeroWithSkillandSkillDetail.mockResolvedValue(
        mockHero,
      );

      const result = await resolver.createHeroWithSkillandSkillDetail(
        createHeroInput,
      );

      expect(service.createHeroWithSkillandSkillDetail).toHaveBeenCalledWith(
        createHeroInput,
      );
      expect(result).toEqual(mockHero);
    });
  });

  describe('findAll', () => {
    it('should return an array of heroes', async () => {
      const mockHeroes = [mockHero];
      mockHeroService.findAll.mockResolvedValue(mockHeroes);

      const result = await resolver.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockHeroes);
    });
  });

  describe('findByName', () => {
    it('should return heroes by name', async () => {
      const mockHeroes = [mockHero];
      mockHeroService.findByName.mockResolvedValue(mockHeroes);

      const result = await resolver.findByName('Test');

      expect(service.findByName).toHaveBeenCalledWith('Test');
      expect(result).toEqual(mockHeroes);
    });
  });

  describe('findById', () => {
    it('should return a hero by id', async () => {
      mockHeroService.findById.mockResolvedValue(mockHero);

      const result = await resolver.findById(mockHeroId);

      expect(service.findById).toHaveBeenCalledWith(mockHeroId);
      expect(result).toEqual(mockHero);
    });
  });

  describe('updateHero', () => {
    it('should update a hero', async () => {
      const updateHeroInput: UpdateHeroInput = {
        name: 'Updated Hero',
      };

      const updatedHero = { ...mockHero, ...updateHeroInput };
      mockHeroService.update.mockResolvedValue(updatedHero);

      const result = await resolver.updateHero(mockHeroId, updateHeroInput);

      expect(service.update).toHaveBeenCalledWith(mockHeroId, updateHeroInput);
      expect(result).toEqual(updatedHero);
    });
  });

  describe('removeHero', () => {
    it('should remove a hero', async () => {
      mockHeroService.remove.mockResolvedValue(mockHero);

      const result = await resolver.removeHero(mockHeroId);

      expect(service.remove).toHaveBeenCalledWith(mockHeroId);
      expect(result).toEqual(mockHero);
    });
  });
});
