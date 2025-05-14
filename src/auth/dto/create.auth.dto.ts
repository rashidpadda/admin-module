import {
  IsString,
  IsNotEmpty,
  Length,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;

  @IsEmail()
  @Length(1, 150)
  email: string;

  @IsString()
  country?: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  @Length(1, 10000)
  captchaToken?: string;

  @IsString()
  @Length(1, 10000)
  role?: string;

  @IsBoolean()
  isSuperAdmin?: boolean;
}
