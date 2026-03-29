import { Injectable, BadRequestException } from '@nestjs/common';
import { ICepProvider, AddressDto } from './cep.provider.interface';

interface ViaCepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
}

@Injectable()
export class ViaCepProvider implements ICepProvider {
  async getAddress(cep: string): Promise<AddressDto | null> {
    try {
      const cleanCep = cep.replace(/\D/g, '');

      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
      );

      const data = (await response.json()) as ViaCepResponse;

      if (data.erro) {
        throw new BadRequestException('CEP inválido ou não encontrado.');
      }

      return {
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
      };
    } catch (error) {
      console.error('Failed to load CEP in ViaCEP:', error);
      return null;
    }
  }
}
