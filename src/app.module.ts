import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/admin.auth.module';
import { DatabaseModule } from './database/database.module';
import { CustomCacheModule } from './cache/custom.cache.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './utils/redisConfig';

import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync(RedisOptions),
    DatabaseModule,
    AuthModule,
    CustomCacheModule,
    UsersModule,
  ],
})
export class AppModule {}
