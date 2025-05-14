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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFAService: TwoFAService,
  ) {}

  @Post('signup')
  async create(@Req() req: AppRequest, @Body() createAuthDto: CreateAuthDto) {
    if (!req.user?.isSuperAdmin) {
      throw new UnprocessableEntityException(
        'You are not authorized to create new admin',
      );
    }
    return await this.authService.create(createAuthDto);
  }

  @Post('signin')
  async signIn(@Body() loginDto: LoginDto) {
    return await this.authService.signIn(loginDto);
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  async signOut(@Req() req: AppRequest) {
    const userId = req?.user?.id;
    return this.authService.signOut(userId);
  }

  // @Post('2fa/generate')
  // @UseGuards(JwtAuthGuard)
  // async generate2Fa(@Req() req: AppRequest) {
  //   const user = req.user; // Get the authenticated user
  //   return this.twoFAService.generate2Fa(user);
  // }

  // @Post('2fa/verify')
  // @UseGuards(JwtAuthGuard)
  // async verify2Fa(@Req() req: AppRequest, @Body() body: { token: string }) {
  //   const user = req.user; // Get the authenticated user
  //   const isValid = await this.twoFAService.verify2Fa(body.token, user);

  //   if (!isValid) {
  //     throw new UnauthorizedException('Invalid 2FA token');
  //   }

  //   return { message: '2FA verification successful' };
  // }

  // @Post('2fa/enable')
  // @UseGuards(JwtAuthGuard)
  // async enable2Fa(@Req() req: AppRequest) {
  //   const user = req.user; // Get the authenticated user
  //   await this.twoFAService.enable2Fa(user);
  //   return { message: '2FA enabled successfully' };
  // }

  // @Post('2fa/disable')
  // @UseGuards(JwtAuthGuard)
  // async disable2Fa(@Req() req: AppRequest) {
  //   const user = req.user; // Get the authenticated user
  //   await this.twoFAService.disable2Fa(user);
  //   return { message: '2FA disabled successfully' };
  // }
}
