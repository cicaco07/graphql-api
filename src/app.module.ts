import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { HeroModule } from './hero/hero.module';
import { SkillModule } from './skill/skill.module';
import { SkillDetailModule } from './skill-detail/skill-detail.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/ml'),
    HeroModule,
    SkillModule,
    SkillDetailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
