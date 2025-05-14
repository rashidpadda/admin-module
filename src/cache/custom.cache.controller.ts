// src/cache/cache.controller.ts
import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { CustomCacheService } from './custom.cache.service';

@Controller('cache')
export class CustomCacheController {
  constructor(private readonly cacheService: CustomCacheService) {}

  @Post()
  async setCache(
    @Body() body: { key: string; value: string; ttl?: number },
  ): Promise<string> {
    await this.cacheService.set(body.key, body.value, body.ttl);
    return `Stored key "${body.key}"`;
  }

  @Get(':key')
  async getCache(@Param('key') key: string): Promise<string | null> {
    return this.cacheService.get(key);
  }

  @Delete(':key')
  async deleteCache(@Param('key') key: string): Promise<string> {
    await this.cacheService.del(key);
    return `Deleted key "${key}"`;
  }
}
