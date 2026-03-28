import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';

describe('RegistrationController', () => {
  let controller: RegistrationController;

  const mockRegistrationService = {
    startOrResume: jest.fn(),
    verifyMfa: jest.fn(),
    updateAddress: jest.fn(),
    updateDocument: jest.fn(),
    updateContact: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationController],
      providers: [
        {
          provide: RegistrationService,
          useValue: mockRegistrationService,
        },
      ],
    }).compile();

    controller = module.get<RegistrationController>(RegistrationController);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('updateDocument', () => {
    it('deve repassar a chamada para o serviço com id e documento', async () => {
      const dto = { document: '12345678900' };
      await controller.updateDocument('123', dto);
      
      expect(mockRegistrationService.updateDocument).toHaveBeenCalledWith('123', '12345678900');
    });
  });

  describe('updateContact', () => {
    it('deve repassar a chamada para o serviço com id e telefone', async () => {
      const dto = { phone: '11999999999' };
      await controller.updateContact('123', dto);
      
      expect(mockRegistrationService.updateContact).toHaveBeenCalledWith('123', '11999999999');
    });
  });
});