import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { NavigationService } from './navigation.service';
import { Navigation } from './entities/navigation.entity';
import { CreateNavigationInput } from './dto/create-navigation.input';
import { UpdateNavigationInput } from './dto/update-navigation.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Resolver(() => Navigation)
export class NavigationResolver {
  constructor(private readonly navigationService: NavigationService) {}

  @Mutation(() => Navigation)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  createNavigation(
    @Args('createNavigationInput') createNavigationInput: CreateNavigationInput,
  ) {
    return this.navigationService.create(createNavigationInput);
  }

  @Query(() => [Navigation], { name: 'navigations' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  findAll() {
    return this.navigationService.findAll();
  }

  @Query(() => Navigation, { name: 'navigation' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.navigationService.findOne(id);
  }

  @Mutation(() => Navigation)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  updateNavigation(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateNavigationInput') updateNavigationInput: UpdateNavigationInput,
  ) {
    return this.navigationService.update(id, updateNavigationInput);
  }

  @Mutation(() => Navigation)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  removeNavigation(@Args('id', { type: () => ID }) id: string) {
    return this.navigationService.remove(id);
  }
}
