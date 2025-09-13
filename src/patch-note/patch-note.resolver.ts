import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PatchNoteService } from './patch-note.service';
import { CreatePatchNoteInput } from './dto/create-patch-note.input';
import { PatchNoteEntity } from './entities/patch-note.entity';
import { HeroPatchNoteEntity } from './entities/hero-patch-note.entity';
import { CreateHeroPatchNoteInput } from './dto/create-hero-patch-note.input';
import { CreateBattlefieldPatchNoteInput } from './dto/create-battlefield-patch-note.input';
import { BattlefieldPatchNoteEntity } from './entities/battlefield-patch-note.entity';
import { SystemPatchNoteEntity } from './entities/system-patch-note.entity';
import { CreateSystemPatchNoteInput } from './dto/create-system-patch-note.input';
import { GameModePatchNoteEntity } from './entities/game-mode-patch-note.entity';
import { CreateGameModePatchNoteInput } from './dto/create-game-mode-patch-note.input';
import { UpdatePatchNoteInput } from './dto/update-patch-note.input';
import { UpdateHeroPatchNoteInput } from './dto/update-hero-patch-note.input';
import { UpdateBattlefieldPatchNoteInput } from './dto/update-battlefield-patch-note.input';
import { UpdateSystemPatchNoteInput } from './dto/update-system-patch-note.input';
import { UpdateGameModePatchNoteInput } from './dto/update-game-mode-patch-note.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => PatchNoteEntity)
export class PatchNoteResolver {
  constructor(private readonly patchNoteService: PatchNoteService) {}

  @Mutation(() => PatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async createPatchNote(
    @Args('createPatchNoteInput') createPatchNoteInput: CreatePatchNoteInput,
    @CurrentUser() user: any,
  ) {
    return await this.patchNoteService.createPatchNote(
      createPatchNoteInput,
      (user as { _id: string })._id,
    );
  }

  @Mutation(() => HeroPatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async createHeroPatchNote(
    @Args('patchNoteId') patchNoteId: string,
    @Args('createHeroPatchNoteInput')
    createHeroPatchNoteInput: CreateHeroPatchNoteInput,
  ) {
    return await this.patchNoteService.createHeroPatchNote(
      patchNoteId,
      createHeroPatchNoteInput,
    );
  }

  @Mutation(() => BattlefieldPatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async createBattlefieldPatchNote(
    @Args('patchNoteId') patchNoteId: string,
    @Args('createBattlefieldPatchNoteInput')
    createBattlefieldPatchNoteInput: CreateBattlefieldPatchNoteInput,
  ) {
    return await this.patchNoteService.createBattlefieldPatchNote(
      patchNoteId,
      createBattlefieldPatchNoteInput,
    );
  }

  @Mutation(() => SystemPatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async createSystemPatchNote(
    @Args('patchNoteId') patchNoteId: string,
    @Args('createSystemPatchNoteInput')
    createSystemPatchNoteInput: CreateSystemPatchNoteInput,
  ) {
    return await this.patchNoteService.createSystemPatchNote(
      patchNoteId,
      createSystemPatchNoteInput,
    );
  }

  @Mutation(() => GameModePatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async createGameModePatchNote(
    @Args('patchNoteId') patchNoteId: string,
    @Args('createGameModePatchNoteInput')
    createGameModePatchNoteInput: CreateGameModePatchNoteInput,
  ) {
    return await this.patchNoteService.createGameModePatchNote(
      patchNoteId,
      createGameModePatchNoteInput,
    );
  }

  @Query(() => [PatchNoteEntity], { name: 'patchNotes' })
  async findAll() {
    return await this.patchNoteService.findAll();
  }

  @Query(() => PatchNoteEntity, { name: 'patchNote' })
  async findOne(@Args('id') id: string) {
    return await this.patchNoteService.findOne(id);
  }

  @Mutation(() => PatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updatePatchNote(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePatchNoteInput')
    updatePatchNoteInput: UpdatePatchNoteInput,
    @CurrentUser() user: any,
  ) {
    return await this.patchNoteService.updatePatchNote(
      id,
      updatePatchNoteInput,
      (user as { _id: string })._id,
    );
  }

  @Mutation(() => HeroPatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updateHeroPatchNote(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateHeroPatchNoteInput')
    updateHeroPatchNoteInput: UpdateHeroPatchNoteInput,
  ) {
    return await this.patchNoteService.updateHeroPatchNote(
      id,
      updateHeroPatchNoteInput,
    );
  }

  @Mutation(() => BattlefieldPatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updateBattlefieldPatchNote(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateBattlefieldPatchNoteInput')
    updateBattlefieldPatchNoteInput: UpdateBattlefieldPatchNoteInput,
  ) {
    return await this.patchNoteService.updateBattlefieldPatchNote(
      id,
      updateBattlefieldPatchNoteInput,
    );
  }

  @Mutation(() => SystemPatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updateSystemPatchNote(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateSystemPatchNoteInput')
    updateSystemPatchNoteInput: UpdateSystemPatchNoteInput,
  ) {
    return await this.patchNoteService.updateSystemPatchNote(
      id,
      updateSystemPatchNoteInput,
    );
  }

  @Mutation(() => GameModePatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updateGameModePatchNote(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateGameModePatchNoteInput')
    updateGameModePatchNoteInput: UpdateGameModePatchNoteInput,
  ) {
    return await this.patchNoteService.updateGameModePatchNote(
      id,
      updateGameModePatchNoteInput,
    );
  }

  @Mutation(() => PatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async removePatchNote(@Args('id', { type: () => ID }) id: string) {
    return await this.patchNoteService.removePatchNote(id);
  }

  @Mutation(() => HeroPatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async removeHeroPatchNote(@Args('id', { type: () => ID }) id: string) {
    return await this.patchNoteService.removeHeroPatchNote(id);
  }

  @Mutation(() => BattlefieldPatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async removeBattlefieldPatchNote(@Args('id', { type: () => ID }) id: string) {
    return await this.patchNoteService.removeBattlefieldPatchNote(id);
  }

  @Mutation(() => SystemPatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async removeSystemPatchNote(@Args('id', { type: () => ID }) id: string) {
    return await this.patchNoteService.removeSystemPatchNote(id);
  }

  @Mutation(() => GameModePatchNoteEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async removeGameModePatchNote(@Args('id', { type: () => ID }) id: string) {
    return await this.patchNoteService.removeGameModePatchNote(id);
  }
}
