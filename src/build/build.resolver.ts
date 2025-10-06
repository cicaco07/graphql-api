import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Int,
  // Float,
} from '@nestjs/graphql';
import { BuildService } from './build.service';
import { CreateBuildInput } from './dto/create-build.input';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { BuildEntity } from './entities/build.entity';

@Resolver(() => BuildEntity)
export class BuildResolver {
  constructor(private readonly buildService: BuildService) {}

  @Mutation(() => BuildEntity)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  async createBuild(
    @Args('createBuildInput') createBuildInput: CreateBuildInput,
    @CurrentUser() user: any,
  ) {
    return await this.buildService.create(
      createBuildInput,
      (user as { _id: string })._id,
      (user as { role: string }).role,
    );
  }

  @Query(() => [BuildEntity], { name: 'builds' })
  async findAll() {
    return await this.buildService.findAll();
  }

  @Query(() => BuildEntity, { name: 'build' })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return await this.buildService.findOne(id);
  }

  @Query(() => [BuildEntity], { name: 'buildsByHero' })
  async findByHero(
    @Args('heroId', { type: () => ID }) heroId: string,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
  ) {
    return await this.buildService.findByHero(heroId, limit, offset);
  }

  // @Query(() => [BuildEntity], { name: 'buildsByUser' })
  // async findByUser(
  //   @Args('userId', { type: () => ID }) userId: string,
  //   @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
  //   @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
  // ) {
  //   return await this.buildService.findByUser(userId, limit, offset);
  // }

  // @Query(() => [BuildEntity], { name: 'myBuilds' })
  // @UseGuards(JwtAuthGuard)
  // async findMyBuilds(
  //   @CurrentUser() user: any,
  //   @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
  //   @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
  // ) {
  //   return await this.buildService.findMyBuilds(
  //     (user as { id: string }).id,
  //     limit,
  //     offset,
  //   );
  // }

  @Query(() => [BuildEntity], { name: 'buildsByUser' })
  async findByUser(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
  ) {
    return await this.buildService.findByUser(userId, limit, offset);
  }

  @Query(() => [BuildEntity], { name: 'myBuilds' })
  @UseGuards(JwtAuthGuard)
  async findMyBuilds(
    @CurrentUser() user: any,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
  ) {
    return await this.buildService.findMyBuilds(
      (user as { id: string }).id,
      limit,
      offset,
    );
  }

  // @Query(() => [Build], { name: 'popularBuilds' })
  // async findPopular(
  //   @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
  //   @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
  // ): Promise<Build[]> {
  //   return await this.buildService.findPopular(limit, offset);
  // }

  @Query(() => [BuildEntity], { name: 'officialBuilds' })
  async findOfficial(
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset?: number,
  ) {
    return await this.buildService.findOfficial(limit, offset);
  }

  @Mutation(() => BuildEntity, { name: 'updateBuild' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  async updateBuild(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateBuildInput') updateBuildInput: CreateBuildInput,
  ) {
    return await this.buildService.update(id, updateBuildInput);
  }

  @Mutation(() => Boolean, { name: 'removeBuild' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  async removeBuild(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return await this.buildService.remove(id);
  }

  // @Mutation(() => Build, { name: 'rateBuild' })
  // @UseGuards(JwtAuthGuard)
  // async rateBuild(
  //   @Args('buildId', { type: () => ID }) buildId: string,
  //   @Args('rating', { type: () => Float }) rating: number,
  //   @CurrentUser() user: any,
  // ): Promise<Build> {
  //   return await this.buildService.rateBuild(buildId, rating, user.id);
  // }
}
