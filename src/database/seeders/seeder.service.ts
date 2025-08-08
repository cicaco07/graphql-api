import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../../auth/entities/user.entity';
import { Role } from '../../auth/enums/role.enum';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async seedUsers(): Promise<void> {
    try {
      // Check if users already exist
      const existingUsersCount = await this.userModel.countDocuments();

      if (existingUsersCount > 0) {
        this.logger.log('Users already exist, skipping user seeding');
        return;
      }

      this.logger.log('Starting user seeding...');

      // Hash password yang akan digunakan untuk semua user
      const defaultPassword = await bcrypt.hash('password123', 12);

      const users = [
        // Super Admin Users
        {
          name: 'Super Admin',
          email: 'superadmin@example.com',
          password: defaultPassword,
          role: Role.SUPER_ADMIN,
        },
        {
          name: 'John Super',
          email: 'john.super@example.com',
          password: defaultPassword,
          role: Role.SUPER_ADMIN,
        },

        // Member Users
        {
          name: 'Member User',
          email: 'member@example.com',
          password: defaultPassword,
          role: Role.MEMBER,
        },
        {
          name: 'Jane Member',
          email: 'jane.member@example.com',
          password: defaultPassword,
          role: Role.MEMBER,
        },
        {
          name: 'Bob Member',
          email: 'bob.member@example.com',
          password: defaultPassword,
          role: Role.MEMBER,
        },

        // Regular Users
        {
          name: 'Regular User',
          email: 'user@example.com',
          password: defaultPassword,
          role: Role.USER,
        },
        {
          name: 'Alice User',
          email: 'alice.user@example.com',
          password: defaultPassword,
          role: Role.USER,
        },
        {
          name: 'Charlie User',
          email: 'charlie.user@example.com',
          password: defaultPassword,
          role: Role.USER,
        },
        {
          name: 'Diana User',
          email: 'diana.user@example.com',
          password: defaultPassword,
          role: Role.USER,
        },
        {
          name: 'Eve User',
          email: 'eve.user@example.com',
          password: defaultPassword,
          role: Role.USER,
        },
      ];

      // Insert users
      await this.userModel.insertMany(users);

      this.logger.log(`Successfully seeded ${users.length} users`);
      this.logger.log('User seeding completed');

      // Log the created users for reference
      this.logger.log('Seeded users:');
      users.forEach((user) => {
        this.logger.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      });
      this.logger.log('Default password for all users: password123');
    } catch (error) {
      this.logger.error('Error seeding users:', error);
      throw error;
    }
  }

  async clearUsers(): Promise<void> {
    try {
      this.logger.log('Clearing all users...');
      await this.userModel.deleteMany({});
      this.logger.log('All users cleared successfully');
    } catch (error) {
      this.logger.error('Error clearing users:', error);
      throw error;
    }
  }

  async seedSampleUsers(): Promise<void> {
    try {
      await this.clearUsers();
      await this.seedUsers();
    } catch (error) {
      this.logger.error('Error in sample user seeding:', error);
      throw error;
    }
  }
}
