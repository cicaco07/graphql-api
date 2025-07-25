import { Module } from '@nestjs/common';
import { EmblemService } from './emblem.service';
import { EmblemResolver } from './emblem.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Emblem, EmblemSchema } from './schemas/emblem.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Emblem.name, schema: EmblemSchema }]),
  ],
  providers: [EmblemResolver, EmblemService],
})
export class EmblemModule {}
