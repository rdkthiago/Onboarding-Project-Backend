import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDocumentDto {
  @IsString()
  @IsNotEmpty({ message: 'O documento é obrigatório' })
  document: string;
}