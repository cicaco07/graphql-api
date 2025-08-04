import { Test, TestingModule } from '@nestjs/testing';
import { HeroService } from './hero.service';
import { Hero } from './schemas/hero.schema';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateHeroInput } from './dto/create-hero.input';

describe('HeroService', () => {
  let heroService: HeroService;
  let model: Model<Hero>;

  const mockHeroService = {
    create: jest.fn(),
    createHeroWithSkillDetail: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),

    // Mock other methods as needed
    // findById: jest.fn().mockReturnThis(),
    // findByIdAndDelete: jest.fn(),
    // populate: jest.fn().mockReturnThis(),
    // exec: jest.fn(),
  };

  const mockHeroInput = {
    name: 'Test Hero',
    alias: 'Test Alias',
    role: ['Warrior'],
    type: ['Melee'],
    avatar: 'test-avatar.png',
    image: 'test-image.png',
    short_description: 'Test description',
    release_date: new Date(),
    durability: 100,
    offense: 80,
    control_effect: 50,
    difficulty: 3,
  };

  const mockHero = {
    _id: 'test-id',
    ...mockHeroInput,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HeroService,
        {
          provide: getModelToken(Hero.name),
          useValue: mockHeroService,
        },
        {
          provide: getModelToken('Skill'),
          useValue: {},
        },
        {
          provide: getModelToken('SkillDetail'),
          useValue: {},
        },
      ],
    }).compile();

    heroService = module.get<HeroService>(HeroService);
    model = module.get<Model<Hero>>(getModelToken(Hero.name));
  });

  describe('create', () => {
    it('should create and return a hero data', async () => {
      const newHero = {
        ...mockHeroInput,
      };
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockHero as any));
      const result = await heroService.create(newHero as CreateHeroInput);
      expect(result).toEqual(mockHero);
    });
  });

  describe('findById', () => {
    it('should return a hero by id', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockHero),
      } as unknown as ReturnType<typeof model.findById>);

      const result = await heroService.findById(mockHero._id);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(model.findById).toHaveBeenCalledWith(mockHero._id);
      expect(result).toEqual(mockHero);
    });

    it('should throw NotFoundException if hero not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      } as unknown as mongoose.Query<Hero, Hero>);

      await expect(heroService.findById('invalid-id')).rejects.toThrow(
        'Hero not found',
      );
    });
  });
});
