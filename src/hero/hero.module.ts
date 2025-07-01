import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HeroService } from './hero.service';
import { HeroResolver } from './hero.resolver';
import { Hero, HeroSchema } from './schemas/hero.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hero.name, schema: HeroSchema }]),
  ],
  providers: [HeroResolver, HeroService],
})
export class HeroModule {}
