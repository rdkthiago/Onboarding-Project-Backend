import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressDto {
  @ApiProperty({ example: '01001000', description: 'CEP apenas números' })
  @IsString()
  @IsNotEmpty({ message: 'O CEP é obrigatório' })
  @Length(8, 9, { message: 'Formato de CEP inválido' })
  zipCode: string;

  @ApiProperty({ example: '123' })
  @IsString()
  @IsNotEmpty({ message: 'O número é obrigatório' })
  number: string;

  @ApiProperty({ example: 'Apto 42', required: false })
  @IsString()
  complement: string;
}
