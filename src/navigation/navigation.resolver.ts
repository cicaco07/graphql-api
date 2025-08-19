import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { NavigationService } from './navigation.service';
import { CreateNavigationInput, NavigationType } from './dto/navigation.dto';
import { UpdateNavigationInput } from './dto/update-navigation.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Resolver(() => NavigationType)
export class NavigationResolver {
  constructor(private readonly navigationService: NavigationService) {}

  @Mutation(() => NavigationType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async createNavigation(
    @Args('createNavigationInput') createNavigationInput: CreateNavigationInput,
  ): Promise<NavigationType> {
    return this.navigationService.createNavigation(createNavigationInput);
  }

  @Query(() => [NavigationType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getAllNavigations(): Promise<NavigationType[]> {
    return this.navigationService.getAllNavigations();
  }

  @Query(() => NavigationType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getNavigationById(@Args('id', { type: () => ID }) id: string) {
    return this.navigationService.getNavigationById(id);
  }

  @Mutation(() => NavigationType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  updateNavigation(
    @Args('updateNavigationInput') updateNavigationInput: UpdateNavigationInput,
  ) {
    return this.navigationService.updateNavigation(updateNavigationInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  removeNavigation(@Args('id', { type: () => ID }) id: string) {
    return this.navigationService.removeNavigation(id);
  }

  @Query(() => [NavigationType])
  @UseGuards(JwtAuthGuard)
  async getUserNavigations(
    @Context()
    context: {
      req: { user: { roles?: string[]; permissions?: string[] } };
    },
  ): Promise<NavigationType[]> {
    const user = context.req.user as {
      roles?: string[];
      permissions?: string[];
    };
    const userRoles = user.roles || [];
    const userPermissions = user.permissions || [];

    return this.navigationService.getNavigationsByRoleAndPermissions(
      userRoles,
      userPermissions,
    );
  }

  @Query(() => [NavigationType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getNavigationTree(): Promise<NavigationType[]> {
    return this.navigationService.getNavigationTree();
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async seedNavigations(): Promise<boolean> {
    await this.navigationService.seedNavigations();
    return true;
  }
}
