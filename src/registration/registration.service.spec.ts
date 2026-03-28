import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegistrationService } from './registration.service';
import { Registration } from './entities/registration.entity';
import { RegistrationStep } from './entities/registration-step.enum';
import { MAIL_PROVIDER } from '../providers/mail.provider.interface';
import { CEP_PROVIDER } from '../providers/cep.provider.interface';
import { BadRequestException } from '@nestjs/common';

describe('RegistrationService', () => {
  let service: RegistrationService;

  const mockRegistrationRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockMailProvider = {
    sendEmail: jest.fn(),
  };

  const mockCepProvider = {
    getAddress: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationService,
        {
          provide: getRepositoryToken(Registration),
          useValue: mockRegistrationRepository,
        },
        { provide: MAIL_PROVIDER, useValue: mockMailProvider },
        { provide: CEP_PROVIDER, useValue: mockCepProvider },
      ],
    }).compile();

    service = module.get<RegistrationService>(RegistrationService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('startOrResume', () => {
    it('deve iniciar um cadastro novo se o e-mail não existir', async () => {
      mockRegistrationRepository.findOne.mockResolvedValue(null);
      
      const newReg = { id: '123', name: 'João', email: 'joao@teste.com', currentStep: RegistrationStep.DOCUMENT };
      
      mockRegistrationRepository.create.mockReturnValue(newReg);
      mockRegistrationRepository.save.mockResolvedValue(newReg);

      const result = await service.startOrResume({ name: 'João', email: 'joao@teste.com' });

      expect(mockRegistrationRepository.findOne).toHaveBeenCalledWith({ where: { email: 'joao@teste.com' } });
      expect(mockRegistrationRepository.create).toHaveBeenCalled();
      expect(mockRegistrationRepository.save).toHaveBeenCalled();
      expect(result.requireMfa).toBe(false);
      expect(result.registrationId).toBe('123');
      expect(result.nextStep).toBe(RegistrationStep.DOCUMENT);
    });

    it('deve barrar o inicio se o cadastro já estiver concluido', async () => {
      mockRegistrationRepository.findOne.mockResolvedValue({
        email: 'maria@teste.com',
        currentStep: RegistrationStep.COMPLETED,
      });

      await expect(
        service.startOrResume({ name: 'Maria', email: 'maria@teste.com' })
      ).rejects.toThrow(BadRequestException);
    });
  });
});