import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SeederService } from '../database/seeders/seeder.service';
import { UserSeeder } from '../database/seeders/user.seeder';
import { BuildSeeder } from '../database/seeders/build.seeder';

async function bootstrap() {
  const logger = new Logger('Seeder');

  try {
    logger.log('Starting application for seeding...');
    const app = await NestFactory.createApplicationContext(AppModule);

    const seederService = app.get(SeederService);
    const userSeeder = app.get(UserSeeder);
    const buildSeeder = app.get(BuildSeeder);

    // Get command line argument
    const command = process.argv[2];

    switch (command) {
      case 'users':
        await seederService.seedUsers();
        break;
      case 'default':
        await userSeeder.seedDefaultUsers();
        break;
      case 'test':
        await userSeeder.seedTestUsers();
        break;
      case 'builds':
        await buildSeeder.seedBuilds();
        break;
      case 'builds:clear':
        await buildSeeder.clearBuilds();
        break;
      case 'builds:reseed':
        await buildSeeder.reseedBuilds();
        break;
      case 'clear':
        await seederService.clearUsers();
        break;
      case 'reset':
        await seederService.seedSampleUsers();
        break;
      default:
        logger.log('Available commands:');
        logger.log('- npm run seed users         : Seed sample users');
        logger.log('- npm run seed default       : Seed default users only');
        logger.log('- npm run seed test          : Seed test users');
        logger.log('- npm run seed builds        : Seed builds');
        logger.log('- npm run seed builds:clear  : Clear all builds');
        logger.log('- npm run seed builds:reseed : Clear and reseed builds');
        logger.log('- npm run seed clear         : Clear all users');
        logger.log('- npm run seed reset         : Clear and reseed users');
        break;
    }

    await app.close();
    logger.log('Seeding process completed');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

bootstrap();
