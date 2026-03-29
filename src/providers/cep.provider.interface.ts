export interface AddressDto {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export const CEP_PROVIDER = 'ICepProvider';

export interface ICepProvider {
  getAddress(cep: string): Promise<AddressDto | null>;
}
