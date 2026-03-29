import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateContactDto {
  @IsString()
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  phone: string;
}
