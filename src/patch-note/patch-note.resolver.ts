import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PatchNote } from './schemas/patch-note.schema';
import { CreatePatchNoteInput } from './dto/create-patch-note.input';
import { UpdatePatchNoteInput } from './dto/update-patch-note.input';
import { PaginatedPatchNotes, PatchNoteService } from './patch-note.service';
import { UseGuards, ValidationPipe } from '@nestjs/common';
import {
  FilterPatchNoteInput,
  PaginatedPatchNotesResponse,
} from './dto/filter-patch-note.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PatchNoteEntity } from './entities/patch-note.entity';

@Resolver(() => PatchNote)
export class PatchNoteResolver {
  constructor(private readonly patchNoteService: PatchNoteService) {}

  @Mutation(() => PatchNote)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  async createPatchNote(
    @Args('createPatchNoteInput', new ValidationPipe())
    createPatchNoteInput: CreatePatchNoteInput,
  ): Promise<PatchNoteEntity> {
    return await this.patchNoteService.create(createPatchNoteInput);
  }

  @Query(() => PaginatedPatchNotesResponse, { name: 'patchNotes' })
  async findAllPatchNotes(
    @Args('filter', { nullable: true })
    filter?: FilterPatchNoteInput,
  ): Promise<PaginatedPatchNotes> {
    return this.patchNoteService.findAll(filter);
  }

  @Query(() => PatchNote, { name: 'patchNote' })
  async findOnePatchNote(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<PatchNote> {
    return this.patchNoteService.findOne(id);
  }

  @Query(() => [PatchNote], { name: 'patchNotesByVersion' })
  async findPatchNotesByVersion(
    @Args('version') version: string,
  ): Promise<PatchNote[]> {
    return this.patchNoteService.findByVersion(version);
  }

  @Query(() => [PatchNote], { name: 'patchNotesByTarget' })
  async findPatchNotesByTarget(
    @Args('targetEntity') targetEntity: string,
  ): Promise<PatchNote[]> {
    return this.patchNoteService.findByTargetEntity(targetEntity);
  }

  @Query(() => [PatchNote], { name: 'patchNotesByTags' })
  async findPatchNotesByTags(
    @Args('tags', { type: () => [String] }) tags: string[],
  ): Promise<PatchNote[]> {
    return this.patchNoteService.findByTags(tags);
  }

  // @Query(() => PatchNoteStatistics, { name: 'patchNoteStatistics' })
  // async getPatchNoteStatistics(): Promise<any> {
  //   return this.patchNoteService.getStatistics();
  // }

  @Mutation(() => PatchNote)
  async updatePatchNote(
    @Args('updatePatchNoteInput', new ValidationPipe())
    updatePatchNoteInput: UpdatePatchNoteInput,
  ): Promise<PatchNote> {
    return this.patchNoteService.update(updatePatchNoteInput);
  }

  @Mutation(() => Boolean)
  async removePatchNote(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.patchNoteService.remove(id);
  }

  @Mutation(() => PatchNote)
  async softDeletePatchNote(
    @Args('id', { type: () => ID }) id: string,
    @Args('userId') userId: string,
  ): Promise<PatchNote> {
    return this.patchNoteService.softDelete(id, userId);
  }
}
