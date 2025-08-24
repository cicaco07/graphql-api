import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { BaseStatService } from './base-stat.service';
import { BaseStat } from './entities/base-stat.entity';
import { CreateBaseStatInput } from './dto/create-base-stat.input';
import { UpdateBaseStatInput } from './dto/update-base-stat.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Resolver(() => BaseStat)
export class BaseStatResolver {
  constructor(private readonly baseStatService: BaseStatService) {}

  @Mutation(() => BaseStat)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  createBaseStat(
    @Args('createBaseStatInput') createBaseStatInput: CreateBaseStatInput,
  ) {
    return this.baseStatService.create(createBaseStatInput);
  }

  @Query(() => [BaseStat], { name: 'baseStat' })
  findAll() {
    return this.baseStatService.findAll();
  }

  @Query(() => BaseStat, { name: 'baseStat' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.baseStatService.findOne(id);
  }

  @Mutation(() => BaseStat)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  updateBaseStat(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateBaseStatInput') updateBaseStatInput: UpdateBaseStatInput,
  ) {
    return this.baseStatService.update(id, updateBaseStatInput);
  }

  @Mutation(() => BaseStat)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.MEMBER, Role.SUPER_ADMIN)
  removeBaseStat(@Args('id', { type: () => ID }) id: string) {
    return this.baseStatService.remove(id);
  }
}
