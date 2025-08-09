import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import {
  BlacklistedToken,
  BlacklistedTokenDocument,
} from '../entities/blacklisted-token.entity';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    @InjectModel(BlacklistedToken.name)
    private blacklistedTokenModel: Model<BlacklistedTokenDocument>,
    private jwtService: JwtService,
  ) {}

  /**
   * Blacklist sebuah token
   */
  async blacklistToken(token: string, userId: string): Promise<void> {
    try {
      // Decode token untuk mendapatkan expiration time
      const decoded = this.jwtService.decode(token);

      if (!decoded || !decoded.exp) {
        throw new Error('Invalid token format');
      }

      const expiresAt = new Date(decoded.exp * 1000); // Convert from seconds to milliseconds

      // Check if token already blacklisted
      const existingToken = await this.blacklistedTokenModel.findOne({ token });
      if (existingToken) {
        this.logger.warn(
          `Token already blacklisted: ${token.substring(0, 20)}...`,
        );
        return;
      }

      // Create blacklisted token record
      const blacklistedToken = new this.blacklistedTokenModel({
        token,
        userId,
        expiresAt,
      });

      await blacklistedToken.save();
      this.logger.log(`Token blacklisted successfully for user: ${userId}`);
    } catch (error) {
      this.logger.error('Error blacklisting token:', error);
      throw error;
    }
  }

  /**
   * Check apakah token sudah di-blacklist
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const blacklistedToken = await this.blacklistedTokenModel.findOne({
        token,
      });
      return !!blacklistedToken;
    } catch (error) {
      this.logger.error('Error checking blacklisted token:', error);
      return false; // Dalam case error, assume token tidak di-blacklist
    }
  }

  /**
   * Blacklist semua token untuk user tertentu (useful untuk "logout everywhere")
   */
  blacklistAllUserTokens(userId: string): void {
    try {
      // Dalam implementasi real, Anda mungkin perlu cara lain untuk track semua active tokens per user
      // Ini adalah simplified approach
      this.logger.log(`Blacklisting all tokens for user: ${userId}`);

      // Alternatif: update user dengan token version/timestamp
      // Sehingga semua token lama menjadi invalid
    } catch (error) {
      this.logger.error('Error blacklisting all user tokens:', error);
      throw error;
    }
  }

  /**
   * Clean up expired blacklisted tokens (optional, karena TTL index sudah handle ini)
   */
  async cleanupExpiredTokens(): Promise<void> {
    try {
      const result = await this.blacklistedTokenModel.deleteMany({
        expiresAt: { $lt: new Date() },
      });

      if (result.deletedCount > 0) {
        this.logger.log(
          `Cleaned up ${result.deletedCount} expired blacklisted tokens`,
        );
      }
    } catch (error) {
      this.logger.error('Error cleaning up expired tokens:', error);
    }
  }
}
