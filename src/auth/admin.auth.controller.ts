import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AppRequest } from 'src/utils/app-request';
import { AuthService } from './admin.auth.service';
import { CreateAuthDto } from './dto/create.auth.dto';
import { LoginDto } from './dto/login.auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TwoFAService } from './admin-2fa.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFAService: TwoFAService,
  ) {}

  @MessagePattern('signup')
  async create(
    @Payload() data: { req: AppRequest; createAuthDto: CreateAuthDto },
  ) {
    const { req, createAuthDto } = data;
    if (!req.user?.isSuperAdmin) {
      throw new UnprocessableEntityException(
        'You are not authorized to create new admin',
      );
    }
    return await this.authService.create(createAuthDto);
  }

  @MessagePattern('signin')
  async signIn(@Payload() loginDto: LoginDto) {
    return await this.authService.signIn(loginDto);
  }

  @MessagePattern('signout')
  async signOut(@Payload() data: { req: AppRequest }) {
    const userId = data.req?.user?.id;
    return this.authService.signOut(userId);
  }

  // @MessagePattern('2fa/generate')
  // async generate2Fa(@Payload() data: { req: AppRequest }) {
  //   const user = data.req.user; // Get the authenticated user
  //   return this.twoFAService.generate2Fa(user);
  // }

  // @MessagePattern('2fa/verify')
  // async verify2Fa(@Payload() data: { req: AppRequest; token: string }) {
  //   const { req, token } = data;
  //   const user = req.user; // Get the authenticated user
  //   const isValid = await this.twoFAService.verify2Fa(token, user);

  //   if (!isValid) {
  //     throw new UnauthorizedException('Invalid 2FA token');
  //   }

  //   return { message: '2FA verification successful' };
  // }

  // @MessagePattern('2fa/enable')
  // async enable2Fa(@Payload() data: { req: AppRequest }) {
  //   const user = data.req.user; // Get the authenticated user
  //   await this.twoFAService.enable2Fa(user);
  //   return { message: '2FA enabled successfully' };
  // }

  // @MessagePattern('2fa/disable')
  // async disable2Fa(@Payload() data: { req: AppRequest }) {
  //   const user = data.req.user; // Get the authenticated user
  //   await this.twoFAService.disable2Fa(user);
  //   return { message: '2FA disabled successfully' };
  // }
}
