import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyMfaDto {
  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'Código de 6 dígitos enviado por e-mail' })
  @IsString()
  @Length(6, 6, { message: 'O código MFA deve ter exatos 6 dígitos' })
  code: string;
}
