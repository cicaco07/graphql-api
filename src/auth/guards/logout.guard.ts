import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class LogoutGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!token) {
      throw new UnauthorizedException('No token provided for logout');
    }

    try {
      // Verify token format
      const decoded = this.jwtService.verify(token);

      // Add token to request for use in resolver
      request.logoutToken = token;
      request.user = decoded;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token for logout');
    }
  }
}
