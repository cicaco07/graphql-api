import { Module } from '@nestjs/common';
import { BaseStatService } from './base-stat.service';
import { BaseStatResolver } from './base-stat.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseStat, BaseStatSchema } from './schemas/base-stat.schema';
import { Hero, HeroSchema } from 'src/hero/schemas/hero.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BaseStat.name, schema: BaseStatSchema },
      { name: Hero.name, schema: HeroSchema },
    ]),
  ],
  providers: [BaseStatResolver, BaseStatService],
})
export class BaseStatModule {}
