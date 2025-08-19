import { Module } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { NavigationResolver } from './navigation.resolver';
import { Navigation, NavigationSchema } from './schemas/navigation.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Navigation.name, schema: NavigationSchema },
    ]),
  ],
  providers: [NavigationResolver, NavigationService],
})
export class NavigationModule {}
