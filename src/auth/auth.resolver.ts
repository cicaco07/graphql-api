import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { AuthResponse, LogoutResponse } from './dto/auth.response';
import {
  RegisterInput,
  LoginInput,
  UpdateUserRoleInput,
} from './dto/auth.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Role } from './enums/role.enum';
import { ExtractJwt } from 'passport-jwt';
import { LogoutGuard } from './guards/logout.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<AuthResponse> {
    return this.authService.register(registerInput);
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User): User {
    return user;
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getAllUsers(): Promise<User[]> {
    return this.authService.getAllUsers();
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updateUserRole(
    @Args('updateUserRoleInput') updateUserRoleInput: UpdateUserRoleInput,
  ): Promise<User> {
    return this.authService.updateUserRole(updateUserRoleInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async deleteUser(@Args('userId') userId: string): Promise<boolean> {
    return this.authService.deleteUser(userId);
  }

  @Mutation(() => LogoutResponse)
  @UseGuards(LogoutGuard)
  async logout(
    @CurrentUser() user: User,
    @Context() context: any,
  ): Promise<LogoutResponse> {
    const request = context.req;
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!token) {
      throw new Error('No token found in request');
    }

    let userId: string | undefined = undefined;
    if ('_id' in user && typeof user._id === 'string') {
      userId = user._id;
    } else if ('sub' in user && typeof user.sub === 'string') {
      userId = user.sub;
    }

    if (!userId) {
      throw new Error('User id not found in token');
    }

    return this.authService.logout(token, userId);
  }

  @Mutation(() => LogoutResponse)
  @UseGuards(JwtAuthGuard)
  async logoutEverywhere(@CurrentUser() user: User): Promise<LogoutResponse> {
    return this.authService.logoutEverywhere(user._id);
  }

  // Optional: Method untuk check token status
  @Query(() => Boolean)
  @UseGuards(JwtAuthGuard)
  isTokenValid(): boolean {
    // Jika sampai sini berarti token valid (sudah di-check di guard)
    return true;
  }
}
