import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDocumentDto {
  @ApiProperty({ example: '12345678900', description: 'CPF ou CNPJ apenas com números' })
  @IsString()
  @IsNotEmpty({ message: 'O documento é obrigatório' })
  document: string;
}
