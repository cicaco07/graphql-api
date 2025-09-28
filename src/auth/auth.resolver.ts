import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterInput,
  LoginInput,
  UpdateUserRoleInput,
} from './dto/auth.input';
import { AuthResponse } from './dto/auth.response';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { LogoutGuard } from './guards/logout.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Role } from './enums/role.enum';
import { ExtractJwt } from 'passport-jwt';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, LogoutGuard)
  async logout(@CurrentUser() user: User, @Context() context: { req: any }) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(context.req);
    if (!token) {
      throw new Error('Token not found');
    }
    const result = await this.authService.logout(token, user._id);
    return result.message;
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  async logoutEverywhere(@CurrentUser() user: User) {
    const result = await this.authService.logoutEverywhere(user._id);
    return result.message;
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updateUserRole(
    @Args('updateUserRoleInput') updateUserRoleInput: UpdateUserRoleInput,
  ) {
    return this.authService.updateUserRole(updateUserRoleInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async deleteUser(@Args('userId') userId: string) {
    return this.authService.deleteUser(userId);
  }
}
