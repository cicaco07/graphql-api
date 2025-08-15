import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { BattleSpellService } from './battle-spell.service';
import { BattleSpell } from './entities/battle-spell.entity';
import { CreateBattleSpellInput } from './dto/create-battle-spell.input';
import { UpdateBattleSpellInput } from './dto/update-battle-spell.input';
import {
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Resolver(() => BattleSpell)
export class BattleSpellResolver {
  constructor(private readonly battleSpellService: BattleSpellService) {}

  @Mutation(() => BattleSpell)
  async createBattleSpell(
    @Args('createBattleSpellInput')
    createBattleSpellInput: CreateBattleSpellInput,
  ): Promise<BattleSpell> {
    const result = await this.battleSpellService.create(createBattleSpellInput);
    return result as BattleSpell;
  }

  async createBattleSpellWithIcon(
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('cooldown') cooldown: number,
    @Args('tag') tag: string[],
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<BattleSpell> {
    const createBattleSpellInput: CreateBattleSpellInput = {
      name,
      description,
      cooldown,
      tag,
    };

    return this.battleSpellService.createWithIcon(
      createBattleSpellInput,
      file?.filename,
    ) as Promise<BattleSpell>;
  }

  @Query(() => [BattleSpell], { name: 'battleSpells' })
  async findAll(): Promise<BattleSpell[]> {
    return this.battleSpellService.findAll() as Promise<BattleSpell[]>;
  }

  @Query(() => BattleSpell, { name: 'battleSpell' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<BattleSpell> {
    return this.battleSpellService.findOne(id) as Promise<BattleSpell>;
  }

  @Mutation(() => BattleSpell)
  async updateBattleSpell(
    @Args('updateBattleSpellInput')
    updateBattleSpellInput: UpdateBattleSpellInput,
  ): Promise<BattleSpell> {
    return this.battleSpellService.update(
      updateBattleSpellInput,
    ) as Promise<BattleSpell>;
  }

  @Mutation(() => BattleSpell)
  async removeBattleSpell(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<BattleSpell> {
    return this.battleSpellService.remove(id) as Promise<BattleSpell>;
  }

  @Mutation(() => BattleSpell)
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            `battle-spell-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadBattleSpellIcon(
    @Args('id', { type: () => ID }) id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BattleSpell> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.battleSpellService.updateIcon(
      id,
      file.filename,
    ) as Promise<BattleSpell>;
  }
}
