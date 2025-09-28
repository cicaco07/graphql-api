import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  BlacklistedToken,
  BlacklistedTokenDocument,
} from '../entities/blacklisted-token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(BlacklistedToken.name)
    private blacklistedTokenModel: Model<BlacklistedTokenDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async blacklistToken(token: string, userId: string): Promise<void> {
    try {
      // Decode token to get expiration
      const decoded = this.jwtService.decode(token);
      const expiresAt = new Date(decoded.exp * 1000);

      // Save to blacklist
      await this.blacklistedTokenModel.create({
        token,
        userId,
        expiresAt,
      });
    } catch (error) {
      throw new Error(`Failed to blacklist token: ${error.message}`);
    }
  }

  async blacklistAllUserTokens(userId: string): Promise<void> {
    try {
      // Create a blacklist entry for all tokens of this user
      // This is a simple approach - in production you might want a more sophisticated method
      const currentTime = new Date();
      const futureTime = new Date(
        currentTime.getTime() + 7 * 24 * 60 * 60 * 1000,
      ); // 7 days

      await this.blacklistedTokenModel.create({
        token: `ALL_TOKENS_${userId}_${currentTime.getTime()}`,
        userId,
        expiresAt: futureTime,
        isAllTokens: true,
      });
    } catch (error) {
      throw new Error(`Failed to blacklist all user tokens: ${error.message}`);
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      // Decode token to get user ID
      const decoded = this.jwtService.decode(token);
      if (!decoded || !decoded.sub) {
        return true;
      }

      const userId = decoded.sub;
      const currentTime = new Date();

      // Check if specific token is blacklisted
      const blacklistedToken = await this.blacklistedTokenModel.findOne({
        token,
        expiresAt: { $gt: currentTime },
      });

      if (blacklistedToken) {
        return true;
      }

      // Check if all user tokens are blacklisted
      const allTokensBlacklisted = await this.blacklistedTokenModel.findOne({
        userId,
        isAllTokens: true,
        expiresAt: { $gt: currentTime },
      });

      return !!allTokensBlacklisted;
    } catch (error) {
      // If we can't verify, assume it's blacklisted for security
      return true;
    }
  }

  async cleanupExpiredTokens(): Promise<void> {
    try {
      const currentTime = new Date();
      await this.blacklistedTokenModel.deleteMany({
        expiresAt: { $lte: currentTime },
      });
    } catch (error) {
      console.error('Failed to cleanup expired tokens:', error);
    }
  }
}
