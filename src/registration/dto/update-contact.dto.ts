import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateContactDto {
  @ApiProperty({ example: '11999999999', description: 'Celular com DDD apenas com números' })
  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  phone: string;
}
