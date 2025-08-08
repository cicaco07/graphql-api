import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../../auth/entities/user.entity';
import { Role } from '../../auth/enums/role.enum';

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: Role;
}

@Injectable()
export class UserSeeder {
  private readonly logger = new Logger(UserSeeder.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(
    userData: Omit<CreateUserData, 'password'> & { password?: string },
  ): Promise<User> {
    const defaultPassword = userData.password || 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
    });

    return await user.save();
  }

  async seedDefaultUsers(): Promise<void> {
    try {
      this.logger.log('Starting default users seeding...');

      // Create Super Admin
      const superAdmin = await this.createUser({
        name: 'System Administrator',
        email: 'admin@system.com',
        role: Role.SUPER_ADMIN,
      });
      this.logger.log(`Created Super Admin: ${superAdmin.email}`);

      // Create Member
      const member = await this.createUser({
        name: 'Content Manager',
        email: 'manager@system.com',
        role: Role.MEMBER,
      });
      this.logger.log(`Created Member: ${member.email}`);

      // Create Regular User
      const user = await this.createUser({
        name: 'Regular Customer',
        email: 'customer@system.com',
        role: Role.USER,
      });
      this.logger.log(`Created User: ${user.email}`);

      this.logger.log('Default users seeding completed successfully');
    } catch (error) {
      if (error.code === 11000) {
        this.logger.warn('Some users already exist, skipping duplicates');
      } else {
        this.logger.error('Error seeding default users:', error);
        throw error;
      }
    }
  }

  async seedTestUsers(): Promise<void> {
    try {
      this.logger.log('Starting test users seeding...');

      const testUsers = [
        {
          name: 'Test Super Admin',
          email: 'test.admin@test.com',
          role: Role.SUPER_ADMIN,
        },
        {
          name: 'Test Member 1',
          email: 'test.member1@test.com',
          role: Role.MEMBER,
        },
        {
          name: 'Test Member 2',
          email: 'test.member2@test.com',
          role: Role.MEMBER,
        },
        { name: 'Test User 1', email: 'test.user1@test.com', role: Role.USER },
        { name: 'Test User 2', email: 'test.user2@test.com', role: Role.USER },
        { name: 'Test User 3', email: 'test.user3@test.com', role: Role.USER },
      ];

      for (const userData of testUsers) {
        try {
          const user = await this.createUser(userData);
          this.logger.log(
            `Created test user: ${user.email} - Role: ${user.role}`,
          );
        } catch (error) {
          if (error.code === 11000) {
            this.logger.warn(`User ${userData.email} already exists, skipping`);
          } else {
            throw error;
          }
        }
      }

      this.logger.log('Test users seeding completed successfully');
    } catch (error) {
      this.logger.error('Error seeding test users:', error);
      throw error;
    }
  }
}
