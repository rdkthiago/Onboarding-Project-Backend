import { Injectable } from '@nestjs/common';
import { ICepProvider, AddressDto } from './cep.provider.interface';

@Injectable()
export class ViaCepProvider implements ICepProvider {
  async getAddress(cep: string): Promise<AddressDto | null> {
    try {
      const cleanCep = cep.replace(/\D/g, ''); 
      
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        return null; 
      }

      return {
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      };
    } catch (error) {
      console.error('Failed to load CEP in ViaCEP:', error);
      return null;
    }
  }
}