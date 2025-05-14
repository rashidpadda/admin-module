import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { CACHE_TYPE } from '../enums/cache.enum';

export class GetCacheDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid user id' }) // UUID v4
  user: string;

  @IsEnum(CACHE_TYPE)
  @IsNotEmpty()
  type: CACHE_TYPE;

  @IsOptional()
  @IsNotEmpty()
  other_Type?: string;
}

export class SetCacheDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid user id' }) // UUID v4
  user: string;

  @IsEnum(CACHE_TYPE)
  @IsNotEmpty()
  type: CACHE_TYPE;

  @IsOptional()
  @IsNotEmpty()
  other_Type?: string;

  @IsObject()
  @IsNotEmpty()
  data: object;
}
