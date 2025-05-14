import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';
export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'username/email is required' })
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @Length(1, 10000)
  captchaToken: string;

  @IsString()
  @IsOptional() // Optional for users without 2FA enabled
  twoFaToken?: string;
}
