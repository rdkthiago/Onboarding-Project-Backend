import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyMfaDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 6, { message: 'O código MFA deve ter exatos 6 dígitos' })
  code: string;
}