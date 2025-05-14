// src/cache/cache.module.ts
import { Module } from '@nestjs/common';
import { CustomCacheService } from './custom.cache.service';
import { CustomCacheController } from './custom.cache.controller';
import { AuthModule } from 'src/auth/admin.auth.module';

@Module({
  providers: [CustomCacheService, AuthModule],
  exports: [CustomCacheService],
  controllers: [CustomCacheController],
})
export class CustomCacheModule {}
