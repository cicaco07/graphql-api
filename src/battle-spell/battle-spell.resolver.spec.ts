import { Test, TestingModule } from '@nestjs/testing';
import { BattleSpellResolver } from './battle-spell.resolver';
import { BattleSpellService } from './battle-spell.service';
import { CreateBattleSpellInput } from './dto/create-battle-spell.input';
import { UpdateBattleSpellInput } from './dto/update-battle-spell.input';
import { NotFoundException } from '@nestjs/common';

// Mock the guards and decorators before importing the resolver
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

jest.mock('../auth/enums/role.enum', () => ({
  Role: {
    MEMBER: 'member',
    SUPER_ADMIN: 'super_admin',
  },
}));

describe('BattleSpellResolver', () => {
  let resolver: BattleSpellResolver;
  let service: BattleSpellService;

  const mockBattleSpell = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Fireball',
    description: 'A powerful fire spell',
    icon: '/icons/fireball.png',
    cooldown: 5,
    tag: 'fire',
  };

  const mockBattleSpellService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BattleSpellResolver,
        {
          provide: BattleSpellService,
          useValue: mockBattleSpellService,
        },
      ],
    }).compile();

    resolver = module.get<BattleSpellResolver>(BattleSpellResolver);
    service = module.get<BattleSpellService>(BattleSpellService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createBattleSpell', () => {
    it('should create a new battle spell', async () => {
      const createBattleSpellInput: CreateBattleSpellInput = {
        name: 'Fireball',
        description: 'A powerful fire spell',
        icon: '/icons/fireball.png',
        cooldown: 5,
        tag: 'fire',
      };

      mockBattleSpellService.create.mockResolvedValue(mockBattleSpell);

      const result = await resolver.createBattleSpell(createBattleSpellInput);

      expect(result).toEqual(mockBattleSpell);
      expect(service.create).toHaveBeenCalledWith(createBattleSpellInput);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should handle service errors', async () => {
      const createBattleSpellInput: CreateBattleSpellInput = {
        name: 'Fireball',
        description: 'A powerful fire spell',
        icon: '/icons/fireball.png',
        cooldown: 5,
        tag: 'fire',
      };

      const error = new Error('Database error');
      mockBattleSpellService.create.mockRejectedValue(error);

      await expect(
        resolver.createBattleSpell(createBattleSpellInput),
      ).rejects.toThrow('Database error');
    });
  });

  describe('findAll', () => {
    it('should return an array of battle spells', async () => {
      const battleSpells = [
        mockBattleSpell,
        {
          ...mockBattleSpell,
          _id: '507f1f77bcf86cd799439012',
          name: 'Ice Blast',
        },
      ];

      mockBattleSpellService.findAll.mockResolvedValue(battleSpells);

      const result = await resolver.findAll();

      expect(result).toEqual(battleSpells);
      expect(service.findAll).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no battle spells exist', async () => {
      mockBattleSpellService.findAll.mockResolvedValue([]);

      const result = await resolver.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a battle spell by id', async () => {
      const id = '507f1f77bcf86cd799439011';

      mockBattleSpellService.findOne.mockResolvedValue(mockBattleSpell);

      const result = await resolver.findOne(id);

      expect(result).toEqual(mockBattleSpell);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when battle spell not found', async () => {
      const id = '507f1f77bcf86cd799439011';

      mockBattleSpellService.findOne.mockRejectedValue(
        new NotFoundException(`BattleSpell with ID "${id}" not found`),
      );

      await expect(resolver.findOne(id)).rejects.toThrow(NotFoundException);
      await expect(resolver.findOne(id)).rejects.toThrow(
        `BattleSpell with ID "${id}" not found`,
      );
    });
  });

  describe('updateBattleSpell', () => {
    it('should update a battle spell', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateBattleSpellInput: UpdateBattleSpellInput = {
        name: 'Updated Fireball',
        cooldown: 10,
      };

      const updatedBattleSpell = {
        ...mockBattleSpell,
        ...updateBattleSpellInput,
      };

      mockBattleSpellService.update.mockResolvedValue(updatedBattleSpell);

      const result = await resolver.updateBattleSpell(
        id,
        updateBattleSpellInput,
      );

      expect(result).toEqual(updatedBattleSpell);
      expect(service.update).toHaveBeenCalledWith(id, updateBattleSpellInput);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when battle spell to update not found', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateBattleSpellInput: UpdateBattleSpellInput = {
        name: 'Updated Fireball',
      };

      mockBattleSpellService.update.mockRejectedValue(
        new NotFoundException(`BattleSpell with ID "${id}" not found`),
      );

      await expect(
        resolver.updateBattleSpell(id, updateBattleSpellInput),
      ).rejects.toThrow(NotFoundException);
      await expect(
        resolver.updateBattleSpell(id, updateBattleSpellInput),
      ).rejects.toThrow(`BattleSpell with ID "${id}" not found`);
    });

    it('should update only provided fields', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateBattleSpellInput: UpdateBattleSpellInput = {
        cooldown: 15,
      };

      const updatedBattleSpell = {
        ...mockBattleSpell,
        cooldown: 15,
      };

      mockBattleSpellService.update.mockResolvedValue(updatedBattleSpell);

      const result = await resolver.updateBattleSpell(
        id,
        updateBattleSpellInput,
      );

      expect(result.cooldown).toBe(15);
      expect(result.name).toBe(mockBattleSpell.name);
      expect(service.update).toHaveBeenCalledWith(id, updateBattleSpellInput);
    });
  });

  describe('removeBattleSpell', () => {
    it('should remove a battle spell', async () => {
      const id = '507f1f77bcf86cd799439011';

      mockBattleSpellService.remove.mockResolvedValue(true);

      const result = await resolver.removeBattleSpell(id);

      expect(result).toBe(true);
      expect(service.remove).toHaveBeenCalledWith(id);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when removing battle spell', async () => {
      const id = '507f1f77bcf86cd799439011';

      const error = new Error('Delete failed');
      mockBattleSpellService.remove.mockRejectedValue(error);

      await expect(resolver.removeBattleSpell(id)).rejects.toThrow(
        'Delete failed',
      );
    });
  });
});
