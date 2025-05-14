import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomCacheService } from 'src/cache/custom.cache.service';
import { ApiResponse } from 'src/utils/apiResponse';
import { User } from '../users/entities/users.model';
import { CreateAuthDto } from './dto/create.auth.dto';
import { LoginDto } from './dto/login.auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { TwoFAService } from './admin-2fa.service';
import { Op } from 'sequelize';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private cacheService: CustomCacheService,
    private twoFAService: TwoFAService,
  ) {}
  async create(createAuthDto: CreateAuthDto): Promise<ApiResponse<any>> {
    try {
      if (!createAuthDto.password) {
        throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
      }

      // Check if username or email already exists
      const existingUser = await User.findOne({
        where: {
          email: createAuthDto.email,
        },
      });

      if (existingUser) {
        throw new HttpException(
          new ApiResponse<null>(
            'User already exists with this email',
            HttpStatus.CONFLICT,
            null,
          ),
          HttpStatus.CONFLICT,
        );
      }

      const existingUsername = await User.findOne({
        where: { username: createAuthDto.username },
      });

      if (existingUsername) {
        throw new HttpException(
          new ApiResponse<null>(
            'Username is already taken',
            HttpStatus.CONFLICT,
            null,
          ),
          HttpStatus.CONFLICT,
        );
      }

      const user = await User.create({
        email: createAuthDto.email,
        username: createAuthDto.username,
        firstName: createAuthDto.firstName,
        lastName: createAuthDto.lastName,
        isSuperAdmin: createAuthDto.isSuperAdmin,
        password: createAuthDto.password,
        country: createAuthDto.country,
      });

      // Generate 2FA secret and QR code
      const { secret, qrCode } = await this.twoFAService.generate2Fa(user);

      const payload = {
        sub: user.id,
        username: user.username,
        email: user.email,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      await this.cacheService.set(
        `auth:token:${user.id}`,
        accessToken,
        parseInt(process.env.JWT_EXPIRES_IN || '0', 10),
      );

      const { password, ...result } = user.toJSON();

      return new ApiResponse<any>(
        'User registered successfully',
        HttpStatus.CREATED,
        {
          user: result,
          access_token: accessToken,
          twoFa: {
            secret,
            qrCode,
          },
        },
      );
    } catch (error) {
      console.log('Error:', error);
      throw new HttpException(
        new ApiResponse<null>(
          'Failed to register user',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(loginDto: LoginDto): Promise<ApiResponse<any>> {
    try {
      const { username, password, twoFaToken } = loginDto;

      // 🔍 Find user by email or username
      const user = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email: username }],
        },
      });

      if (!user) {
        throw new HttpException(
          new ApiResponse<null>(
            'Invalid credentials',
            HttpStatus.UNAUTHORIZED,
            null,
          ),
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isPasswordValid = await bcrypt.compare(
        password.trim(),
        user.password,
      );
      if (!isPasswordValid) {
        throw new HttpException(
          new ApiResponse<null>(
            'Invalid credentials',
            HttpStatus.UNAUTHORIZED,
            null,
          ),
          HttpStatus.UNAUTHORIZED,
        );
      }

      // const qr = await this.twoFAService.generate2Fa(user);

      // 🎫 Generate JWT
      const payload = {
        sub: user.id,
        email: user.email,
        username: user.username,
      };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      await this.cacheService.set(
        `auth:token:${user.id}`,
        accessToken,
        parseInt(process.env.JWT_EXPIRES_IN || '0', 10),
      );

      const { password: _, ...userInfo } = user.toJSON();

      return new ApiResponse<any>('Login successful', HttpStatus.OK, {
        accessToken,
        user: userInfo,
      });
    } catch (error) {
      throw new HttpException(
        new ApiResponse<null>(
          'Failed to sign in',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signOut(userId?: string): Promise<ApiResponse<null>> {
    try {
      if (!userId) {
        throw new HttpException(
          new ApiResponse<null>(
            'User ID is required',
            HttpStatus.BAD_REQUEST,
            null,
          ),
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.cacheService.del(`auth:token:${userId}`);

      return new ApiResponse<null>(
        'User signed out successfully, token invalidated',
        HttpStatus.OK,
        null,
      );
    } catch (error) {
      throw new HttpException(
        new ApiResponse<null>(
          'Failed to sign out',
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          error.message,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
