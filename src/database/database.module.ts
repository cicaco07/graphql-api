import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/entities/user.entity';
import { SeederService } from './seeders/seeder.service';
import { UserSeeder } from './seeders/user.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [SeederService, UserSeeder],
  exports: [SeederService, UserSeeder],
})
export class DatabaseModule {}
