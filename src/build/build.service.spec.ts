import { Test, TestingModule } from '@nestjs/testing';
import { BuildService } from './build.service';
import { getModelToken } from '@nestjs/mongoose';
import { Build } from './schemas/build.schema';
import { Hero } from '../hero/schemas/hero.schema';
import { Item } from '../item/schemas/item.schema';
import { Emblem } from '../emblem/schemas/emblem.schema';
import { BattleSpell } from '../battle-spell/schemas/battle-spell.schema';
import { User } from '../auth/entities/user.entity';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateBuildInput } from './dto/create-build.input';
import { Types } from 'mongoose';

describe('BuildService', () => {
  let service: BuildService;
  let buildModel: any;
  let heroModel: any;
  let userModel: any;
  let itemModel: any;
  let emblemModel: any;
  let battleSpellModel: any;

  const mockObjectId = '507f1f77bcf86cd799439011';
  const mockUserId = '507f1f77bcf86cd799439012';
  const mockHeroId = '507f1f77bcf86cd799439013';
  const mockItemId1 = '507f1f77bcf86cd799439014';
  const mockItemId2 = '507f1f77bcf86cd799439015';
  const mockEmblemId = '507f1f77bcf86cd799439016';
  const mockSpellId = '507f1f77bcf86cd799439017';

  const mockBuild = {
    _id: mockObjectId,
    name: 'Build Mage Terbaik',
    role: 'Mid Lane',
    description: 'Build untuk mage dengan damage tinggi',
    hero: mockHeroId,
    items: [
      { item: mockItemId1, order: 1 },
      { item: mockItemId2, order: 2 },
    ],
    emblems: [mockEmblemId],
    battle_spells: [mockSpellId],
    user: mockUserId,
    is_official: false,
    save: jest.fn().mockResolvedValue(this),
  };

  const mockHero = {
    _id: mockHeroId,
    name: 'Kagura',
  };

  const mockItem = {
    _id: mockItemId1,
    name: 'Lightning Truncheon',
  };

  const mockEmblem = {
    _id: mockEmblemId,
    name: 'Magic Emblem',
  };

  const mockBattleSpell = {
    _id: mockSpellId,
    name: 'Flicker',
  };

  const mockBuildDocument = {
    ...mockBuild,
    save: jest.fn().mockResolvedValue(mockBuild),
    _id: { toString: () => mockObjectId },
  };

  const mockBuildModel = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...mockBuild, ...dto }),
    _id: { toString: () => mockObjectId },
  })) as any;

  mockBuildModel.find = jest.fn();
  mockBuildModel.findById = jest.fn();
  mockBuildModel.findByIdAndDelete = jest.fn();
  mockBuildModel.countDocuments = jest.fn();

  const mockHeroModel = {
    findById: jest.fn(),
  };

  const mockUserModel = {
    findById: jest.fn(),
  };

  const mockItemModel = {
    find: jest.fn(),
  };

  const mockEmblemModel = {
    find: jest.fn(),
  };

  const mockBattleSpellModel = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildService,
        {
          provide: getModelToken(Build.name),
          useValue: mockBuildModel,
        },
        {
          provide: getModelToken(Hero.name),
          useValue: mockHeroModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Item.name),
          useValue: mockItemModel,
        },
        {
          provide: getModelToken(Emblem.name),
          useValue: mockEmblemModel,
        },
        {
          provide: getModelToken(BattleSpell.name),
          useValue: mockBattleSpellModel,
        },
      ],
    }).compile();

    service = module.get<BuildService>(BuildService);
    buildModel = module.get(getModelToken(Build.name));
    heroModel = module.get(getModelToken(Hero.name));
    userModel = module.get(getModelToken(User.name));
    itemModel = module.get(getModelToken(Item.name));
    emblemModel = module.get(getModelToken(Emblem.name));
    battleSpellModel = module.get(getModelToken(BattleSpell.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createBuildInput: CreateBuildInput = {
      name: 'Build Mage Terbaik',
      role: 'Mid Lane',
      description: 'Build untuk mage dengan damage tinggi',
      heroId: mockHeroId,
      items: [
        { itemId: mockItemId1, order: 1 },
        { itemId: mockItemId2, order: 2 },
      ],
      emblemIds: [mockEmblemId],
      battleSpellIds: [mockSpellId],
    };

    it('should create a new build successfully', async () => {
      mockHeroModel.findById.mockResolvedValue(mockHero);
      mockItemModel.find.mockResolvedValue([
        { _id: mockItemId1 },
        { _id: mockItemId2 },
      ]);
      mockEmblemModel.find.mockResolvedValue([{ _id: mockEmblemId }]);
      mockBattleSpellModel.find.mockResolvedValue([{ _id: mockSpellId }]);

      jest.spyOn(service, 'findOne').mockResolvedValue(mockBuild as any);

      const result = await service.create(
        createBuildInput,
        mockUserId,
        'member',
      );

      expect(result).toBeDefined();
      expect(mockHeroModel.findById).toHaveBeenCalledWith(mockHeroId);
      expect(mockBuildModel).toHaveBeenCalled();
    });

    it('should throw NotFoundException when hero not found', async () => {
      mockHeroModel.findById.mockResolvedValue(null);

      await expect(
        service.create(createBuildInput, mockUserId, 'member'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.create(createBuildInput, mockUserId, 'member'),
      ).rejects.toThrow(`Hero with ID ${mockHeroId} not found`);
    });

    it('should throw NotFoundException when items not found', async () => {
      mockHeroModel.findById.mockResolvedValue(mockHero);
      mockItemModel.find.mockResolvedValue([{ _id: mockItemId1 }]);

      await expect(
        service.create(createBuildInput, mockUserId, 'member'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when item orders are not unique', async () => {
      const invalidInput = {
        ...createBuildInput,
        items: [
          { itemId: mockItemId1, order: 1 },
          { itemId: mockItemId2, order: 1 },
        ],
      };

      mockHeroModel.findById.mockResolvedValue(mockHero);
      mockItemModel.find.mockResolvedValue([
        { _id: mockItemId1 },
        { _id: mockItemId2 },
      ]);
      mockEmblemModel.find.mockResolvedValue([{ _id: mockEmblemId }]);
      mockBattleSpellModel.find.mockResolvedValue([{ _id: mockSpellId }]);

      await expect(
        service.create(invalidInput, mockUserId, 'member'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(invalidInput, mockUserId, 'member'),
      ).rejects.toThrow('Item orders must be unique');
    });

    it('should throw BadRequestException when item orders are not sequential', async () => {
      const invalidInput = {
        ...createBuildInput,
        items: [
          { itemId: mockItemId1, order: 1 },
          { itemId: mockItemId2, order: 3 },
        ],
      };

      mockHeroModel.findById.mockResolvedValue(mockHero);
      mockItemModel.find.mockResolvedValue([
        { _id: mockItemId1 },
        { _id: mockItemId2 },
      ]);
      mockEmblemModel.find.mockResolvedValue([{ _id: mockEmblemId }]);
      mockBattleSpellModel.find.mockResolvedValue([{ _id: mockSpellId }]);

      await expect(
        service.create(invalidInput, mockUserId, 'member'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(invalidInput, mockUserId, 'member'),
      ).rejects.toThrow('Item orders must be sequential starting from 1');
    });
  });

  describe('findAll', () => {
    it('should return an array of builds', async () => {
      const builds = [mockBuild];

      mockBuildModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(builds),
      });
      mockBuildModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(builds.length),
      });

      const result = await service.findAll();

      expect(result).toEqual({
        items: builds,
        total: builds.length,
        limit: 10,
        offset: 0,
      });
      expect(mockBuildModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a build by id', async () => {
      mockBuildModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBuild),
      });

      const result = await service.findOne(mockObjectId);

      expect(result).toEqual(mockBuild);
      expect(mockBuildModel.findById).toHaveBeenCalledWith(mockObjectId);
    });

    it('should throw NotFoundException when build not found', async () => {
      mockBuildModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne(mockObjectId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(mockObjectId)).rejects.toThrow(
        `Build with ID ${mockObjectId} not found`,
      );
    });
  });

  describe('findByHero', () => {
    it('should return builds for a specific hero', async () => {
      mockHeroModel.findById.mockResolvedValue(mockHero);
      mockBuildModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockBuild]),
      });

      const result = await service.findByHero(mockHeroId, 10, 0);

      expect(result).toEqual([mockBuild]);
      expect(mockHeroModel.findById).toHaveBeenCalledWith(mockHeroId);
    });

    it('should throw NotFoundException when hero not found', async () => {
      mockHeroModel.findById.mockResolvedValue(null);

      await expect(service.findByHero(mockHeroId, 10, 0)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByUser', () => {
    it('should return builds for a specific user', async () => {
      mockBuildModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockBuild]),
      });

      const result = await service.findByUser(mockUserId, 10, 0);

      expect(result).toEqual([mockBuild]);
    });

    it('should throw BadRequestException for invalid user ID', async () => {
      await expect(service.findByUser('invalid-id', 10, 0)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findMyBuilds', () => {
    it('should return builds for current user', async () => {
      mockBuildModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockBuild]),
      });

      const result = await service.findMyBuilds(mockUserId, 10, 0);

      expect(result).toEqual([mockBuild]);
    });

    it('should throw BadRequestException for invalid user ID', async () => {
      await expect(service.findMyBuilds('invalid-id', 10, 0)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findOfficial', () => {
    it('should return official builds', async () => {
      const officialBuild = { ...mockBuild, is_official: true };

      mockBuildModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([officialBuild]),
      });

      const result = await service.findOfficial(10, 0);

      expect(result).toEqual([officialBuild]);
      expect(mockBuildModel.find).toHaveBeenCalledWith({ is_official: true });
    });
  });

  describe('remove', () => {
    it('should remove a build successfully', async () => {
      const populateMock = jest.fn().mockResolvedValue(mockBuild);
      mockBuildModel.findById.mockReturnValue({
        populate: populateMock,
      });
      mockBuildModel.findByIdAndDelete.mockResolvedValue(mockBuild);

      const result = await service.remove(mockObjectId);

      expect(result).toBe(true);
      expect(mockBuildModel.findByIdAndDelete).toHaveBeenCalledWith(
        mockObjectId,
      );
    });

    it('should throw NotFoundException when build not found', async () => {
      const populateMock = jest.fn().mockResolvedValue(null);
      mockBuildModel.findById.mockReturnValue({
        populate: populateMock,
      });

      await expect(service.remove(mockObjectId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockBuildModel.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when trying to delete official build', async () => {
      const officialBuild = { ...mockBuild, is_official: true };
      const populateMock = jest.fn().mockResolvedValue(officialBuild);
      mockBuildModel.findById.mockReturnValue({
        populate: populateMock,
      });

      await expect(service.remove(mockObjectId)).rejects.toThrow(
        ForbiddenException,
      );
      await expect(service.remove(mockObjectId)).rejects.toThrow(
        'Official builds cannot be deleted',
      );
      expect(mockBuildModel.findByIdAndDelete).not.toHaveBeenCalled();
    });
  });
});
