import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'O CEP é obrigatório' })
  @Length(8, 9, { message: 'Formato de CEP inválido' })
  zipCode: string;

  @IsString()
  @IsNotEmpty({ message: 'O número é obrigatório' })
  number: string;

  @IsString()
  complement: string;
}
