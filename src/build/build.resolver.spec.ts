import { Test, TestingModule } from '@nestjs/testing';
import { BuildResolver } from './build.resolver';
import { BuildService } from './build.service';
import { CreateBuildInput } from './dto/create-build.input';
import { NotFoundException } from '@nestjs/common';

// Mock the guards and decorators
jest.mock('../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

jest.mock('../auth/guards/roles.guard', () => ({
  RolesGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

jest.mock('../auth/decorators/roles.decorator', () => ({
  Roles: jest.fn().mockReturnValue(() => {}),
}));

jest.mock('../auth/decorators/current-user.decorator', () => ({
  CurrentUser: jest.fn().mockReturnValue(() => {}),
}));

jest.mock('../auth/enums/role.enum', () => ({
  Role: {
    MEMBER: 'member',
    SUPER_ADMIN: 'super_admin',
  },
}));

describe('BuildResolver', () => {
  let resolver: BuildResolver;
  let service: BuildService;

  const mockObjectId = '507f1f77bcf86cd799439011';
  const mockUserId = '507f1f77bcf86cd799439012';
  const mockHeroId = '507f1f77bcf86cd799439013';

  const mockBuild = {
    _id: mockObjectId,
    name: 'Build Mage Terbaik',
    role: 'Mid Lane',
    description: 'Build untuk mage dengan damage tinggi',
    hero: mockHeroId,
    items: [],
    emblems: [],
    battle_spells: [],
    user: mockUserId,
    is_official: false,
  };

  const mockUser = {
    _id: mockUserId,
    id: mockUserId,
    role: 'member',
  };

  const mockBuildService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByHero: jest.fn(),
    findByUser: jest.fn(),
    findMyBuilds: jest.fn(),
    findOfficial: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuildResolver,
        {
          provide: BuildService,
          useValue: mockBuildService,
        },
      ],
    }).compile();

    resolver = module.get<BuildResolver>(BuildResolver);
    service = module.get<BuildService>(BuildService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createBuild', () => {
    const createBuildInput: CreateBuildInput = {
      name: 'Build Mage Terbaik',
      role: 'Mid Lane',
      description: 'Build untuk mage dengan damage tinggi',
      heroId: mockHeroId,
      items: [
        { itemId: '507f1f77bcf86cd799439014', order: 1 },
        { itemId: '507f1f77bcf86cd799439015', order: 2 },
      ],
      emblemIds: ['507f1f77bcf86cd799439016'],
      battleSpellIds: ['507f1f77bcf86cd799439017'],
    };

    it('should create a new build', async () => {
      mockBuildService.create.mockResolvedValue(mockBuild);

      const result = await resolver.createBuild(createBuildInput, mockUser);

      expect(result).toEqual(mockBuild);
      expect(service.create).toHaveBeenCalledWith(
        createBuildInput,
        mockUserId,
        'member',
      );
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      mockBuildService.create.mockRejectedValue(error);

      await expect(
        resolver.createBuild(createBuildInput, mockUser),
      ).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return an array of builds', async () => {
      const builds = [mockBuild];
      mockBuildService.findAll.mockResolvedValue(builds);

      const result = await resolver.findAll();

      expect(result).toEqual(builds);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no builds exist', async () => {
      mockBuildService.findAll.mockResolvedValue([]);

      const result = await resolver.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a build by id', async () => {
      mockBuildService.findOne.mockResolvedValue(mockBuild);

      const result = await resolver.findOne(mockObjectId);

      expect(result).toEqual(mockBuild);
      expect(service.findOne).toHaveBeenCalledWith(mockObjectId);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when build not found', async () => {
      mockBuildService.findOne.mockRejectedValue(
        new NotFoundException(`Build with ID ${mockObjectId} not found`),
      );

      await expect(resolver.findOne(mockObjectId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(resolver.findOne(mockObjectId)).rejects.toThrow(
        `Build with ID ${mockObjectId} not found`,
      );
    });
  });

  describe('findByHero', () => {
    it('should return builds for a specific hero', async () => {
      const builds = [mockBuild];
      mockBuildService.findByHero.mockResolvedValue(builds);

      const result = await resolver.findByHero(mockHeroId, 10, 0);

      expect(result).toEqual(builds);
      expect(service.findByHero).toHaveBeenCalledWith(mockHeroId, 10, 0);
      expect(service.findByHero).toHaveBeenCalledTimes(1);
    });

    it('should use default limit and offset', async () => {
      mockBuildService.findByHero.mockResolvedValue([mockBuild]);

      await resolver.findByHero(mockHeroId, undefined, undefined);

      expect(service.findByHero).toHaveBeenCalledWith(
        mockHeroId,
        undefined,
        undefined,
      );
    });

    it('should throw NotFoundException when hero not found', async () => {
      mockBuildService.findByHero.mockRejectedValue(
        new NotFoundException(`Hero with ID ${mockHeroId} not found`),
      );

      await expect(resolver.findByHero(mockHeroId, 10, 0)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByUser', () => {
    it('should return builds for a specific user', async () => {
      const builds = [mockBuild];
      mockBuildService.findByUser.mockResolvedValue(builds);

      const result = await resolver.findByUser(mockUserId, 10, 0);

      expect(result).toEqual(builds);
      expect(service.findByUser).toHaveBeenCalledWith(mockUserId, 10, 0);
      expect(service.findByUser).toHaveBeenCalledTimes(1);
    });

    it('should use default limit and offset', async () => {
      mockBuildService.findByUser.mockResolvedValue([mockBuild]);

      await resolver.findByUser(mockUserId, undefined, undefined);

      expect(service.findByUser).toHaveBeenCalledWith(
        mockUserId,
        undefined,
        undefined,
      );
    });
  });

  describe('findMyBuilds', () => {
    it('should return builds for current user', async () => {
      const builds = [mockBuild];
      mockBuildService.findMyBuilds.mockResolvedValue(builds);

      const result = await resolver.findMyBuilds(mockUser, 10, 0);

      expect(result).toEqual(builds);
      expect(service.findMyBuilds).toHaveBeenCalledWith(mockUserId, 10, 0);
      expect(service.findMyBuilds).toHaveBeenCalledTimes(1);
    });

    it('should use default limit and offset', async () => {
      mockBuildService.findMyBuilds.mockResolvedValue([mockBuild]);

      await resolver.findMyBuilds(mockUser, undefined, undefined);

      expect(service.findMyBuilds).toHaveBeenCalledWith(
        mockUserId,
        undefined,
        undefined,
      );
    });
  });

  describe('findOfficial', () => {
    it('should return official builds', async () => {
      const officialBuild = { ...mockBuild, is_official: true };
      mockBuildService.findOfficial.mockResolvedValue([officialBuild]);

      const result = await resolver.findOfficial(10, 0);

      expect(result).toEqual([officialBuild]);
      expect(service.findOfficial).toHaveBeenCalledWith(10, 0);
      expect(service.findOfficial).toHaveBeenCalledTimes(1);
    });

    it('should use default limit and offset', async () => {
      mockBuildService.findOfficial.mockResolvedValue([]);

      await resolver.findOfficial(undefined, undefined);

      expect(service.findOfficial).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  describe('updateBuild', () => {
    const updateBuildInput: CreateBuildInput = {
      name: 'Build Mage Updated',
      role: 'Mid Lane',
      description: 'Build updated',
      heroId: mockHeroId,
      items: [{ itemId: '507f1f77bcf86cd799439014', order: 1 }],
      emblemIds: ['507f1f77bcf86cd799439016'],
      battleSpellIds: ['507f1f77bcf86cd799439017'],
    };

    it('should update a build', async () => {
      const updatedBuild = { ...mockBuild, ...updateBuildInput };
      mockBuildService.update.mockResolvedValue(updatedBuild);

      const result = await resolver.updateBuild(mockObjectId, updateBuildInput);

      expect(result).toEqual(updatedBuild);
      expect(service.update).toHaveBeenCalledWith(
        mockObjectId,
        updateBuildInput,
      );
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when build to update not found', async () => {
      mockBuildService.update.mockRejectedValue(
        new NotFoundException(`Build with ID ${mockObjectId} not found`),
      );

      await expect(
        resolver.updateBuild(mockObjectId, updateBuildInput),
      ).rejects.toThrow(NotFoundException);
      await expect(
        resolver.updateBuild(mockObjectId, updateBuildInput),
      ).rejects.toThrow(`Build with ID ${mockObjectId} not found`);
    });
  });

  describe('removeBuild', () => {
    it('should remove a build', async () => {
      mockBuildService.remove.mockResolvedValue(true);

      const result = await resolver.removeBuild(mockObjectId);

      expect(result).toBe(true);
      expect(service.remove).toHaveBeenCalledWith(mockObjectId);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when build not found', async () => {
      mockBuildService.remove.mockRejectedValue(
        new NotFoundException(`Build with ID ${mockObjectId} not found`),
      );

      await expect(resolver.removeBuild(mockObjectId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle errors when removing build', async () => {
      const error = new Error('Delete failed');
      mockBuildService.remove.mockRejectedValue(error);

      await expect(resolver.removeBuild(mockObjectId)).rejects.toThrow(
        'Delete failed',
      );
    });
  });
});
