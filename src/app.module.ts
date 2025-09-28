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
import { GraphQLJSON } from 'graphql-type-json';
import { ItemModule } from './item/item.module';
import { EmblemModule } from './emblem/emblem.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { BattleSpellModule } from './battle-spell/battle-spell.module';
// import { MulterModule } from '@nestjs/platform-express';
// import { ServeStaticModule } from '@nestjs/serve-static';
import { NavigationModule } from './navigation/navigation.module';
import { BaseStatModule } from './base-stat/base-stat.module';
import { PatchNoteModule } from './patch-note/patch-note.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile:
        process.env.NODE_ENV === 'production'
          ? true
          : join(process.cwd(), 'src/schema.gql'),
      resolvers: { JSON: GraphQLJSON },
      context: ({ req }: { req: Request }) => ({ req }),
      sortSchema: true,
      playground: true,
      introspection: true,
      ...(process.env.NODE_ENV === 'production' && {
        csrfPrevention: false,
        cors: {
          origin: true,
          credentials: true,
        },
      }),
    }),
    // MulterModule.register({
    //   dest: './uploads',
    //   limits: {
    //     fileSize: parseInt('5242880') || 5 * 1024 * 1024, // 5MB
    //     files: 1,
    //   },
    // }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),
    //   serveRoot: '/uploads',
    //   serveStaticOptions: {
    //     index: false,
    //     dotfiles: 'deny',
    //   },
    // }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGO_URI') ||
          'mongodb://localhost:27017/ml',
      }),
      inject: [ConfigService],
    }),
    HeroModule,
    SkillModule,
    SkillDetailModule,
    ItemModule,
    EmblemModule,
    AuthModule,
    DatabaseModule,
    BattleSpellModule,
    NavigationModule,
    BaseStatModule,
    PatchNoteModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'GraphQLJSON', useValue: GraphQLJSON }],
})
export class AppModule {}
