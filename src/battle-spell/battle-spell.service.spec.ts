import { Test, TestingModule } from '@nestjs/testing';
import { BattleSpellService } from './battle-spell.service';
import { getModelToken } from '@nestjs/mongoose';
import { BattleSpell } from './schemas/battle-spell.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { CreateBattleSpellInput } from './dto/create-battle-spell.input';
import { UpdateBattleSpellInput } from './dto/update-battle-spell.input';

describe('BattleSpellService', () => {
  let service: BattleSpellService;
  let model: Model<BattleSpell>;

  const mockBattleSpell = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Fireball',
    description: 'A powerful fire spell',
    icon: '/icons/fireball.png',
    cooldown: 5,
    tag: 'fire',
    save: jest.fn().mockResolvedValue(this),
  };

  const mockBattleSpellDocument = {
    ...mockBattleSpell,
    save: jest.fn().mockResolvedValue(mockBattleSpell),
  };

  const mockBattleSpellModel = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...mockBattleSpell, ...dto }),
  })) as any;

  mockBattleSpellModel.find = jest.fn();
  mockBattleSpellModel.findById = jest.fn();
  mockBattleSpellModel.findByIdAndUpdate = jest.fn();
  mockBattleSpellModel.findByIdAndDelete = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BattleSpellService,
        {
          provide: getModelToken(BattleSpell.name),
          useValue: mockBattleSpellModel,
        },
      ],
    }).compile();

    service = module.get<BattleSpellService>(BattleSpellService);
    model = module.get<Model<BattleSpell>>(getModelToken(BattleSpell.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new battle spell', async () => {
      const createBattleSpellInput: CreateBattleSpellInput = {
        name: 'Fireball',
        description: 'A powerful fire spell',
        icon: '/icons/fireball.png',
        cooldown: 5,
        tag: 'fire',
      };

      const result = await service.create(createBattleSpellInput);

      expect(result).toBeDefined();
      expect(mockBattleSpellModel).toHaveBeenCalledWith({
        ...createBattleSpellInput,
        cooldown: Number(createBattleSpellInput.cooldown),
      });
    });

    it('should convert cooldown to number', async () => {
      const createBattleSpellInput: CreateBattleSpellInput = {
        name: 'Ice Blast',
        description: 'A freezing spell',
        icon: '/icons/ice.png',
        cooldown: 3,
        tag: 'ice',
      };

      await service.create(createBattleSpellInput);

      expect(mockBattleSpellModel).toHaveBeenCalledWith(
        expect.objectContaining({
          cooldown: expect.any(Number),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of battle spells', async () => {
      const battleSpells = [mockBattleSpell, { ...mockBattleSpell, _id: '507f1f77bcf86cd799439012' }];
      
      mockBattleSpellModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(battleSpells),
      });

      const result = await service.findAll();

      expect(result).toEqual(battleSpells);
      expect(mockBattleSpellModel.find).toHaveBeenCalled();
    });

    it('should return an empty array when no battle spells exist', async () => {
      mockBattleSpellModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockBattleSpellModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a battle spell by id', async () => {
      const id = '507f1f77bcf86cd799439011';
      
      mockBattleSpellModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBattleSpell),
      });

      const result = await service.findOne(id);

      expect(result).toEqual(mockBattleSpell);
      expect(mockBattleSpellModel.findById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when battle spell not found', async () => {
      const id = '507f1f77bcf86cd799439011';
      
      mockBattleSpellModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(id)).rejects.toThrow(
        `BattleSpell with ID "${id}" not found`,
      );
    });
  });

  describe('update', () => {
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

      mockBattleSpellModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedBattleSpell),
      });

      const result = await service.update(id, updateBattleSpellInput);

      expect(result).toEqual(updatedBattleSpell);
      expect(mockBattleSpellModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updateBattleSpellInput,
        { new: true },
      );
    });

    it('should throw NotFoundException when battle spell to update not found', async () => {
      const id = '507f1f77bcf86cd799439011';
      const updateBattleSpellInput: UpdateBattleSpellInput = {
        name: 'Updated Fireball',
      };

      mockBattleSpellModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(id, updateBattleSpellInput)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(id, updateBattleSpellInput)).rejects.toThrow(
        `BattleSpell with ID "${id}" not found`,
      );
    });
  });

  describe('remove', () => {
    it('should remove a battle spell', async () => {
      const id = '507f1f77bcf86cd799439011';

      mockBattleSpellModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBattleSpell),
      });

      const result = await service.remove(id);

      expect(result).toBe(true);
      expect(mockBattleSpellModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('should return true even if battle spell not found', async () => {
      const id = '507f1f77bcf86cd799439011';

      mockBattleSpellModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.remove(id);

      expect(result).toBe(true);
    });
  });
});
