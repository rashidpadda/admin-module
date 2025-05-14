import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './admin.auth.service';
import { AuthController } from './admin.auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { jwtConstants } from '../utils/constants';
import { CustomCacheService } from 'src/cache/custom.cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TwoFAService } from './admin-2fa.service';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET') || jwtConstants.secret,
        signOptions: { expiresIn: '60s' },
      }),
    }),
    forwardRef(() => AuthModule),
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtService,
    CustomCacheService,
    TwoFAService,
  ],
  exports: [AuthService, JwtService, JwtModule],
})
export class AuthModule {}
