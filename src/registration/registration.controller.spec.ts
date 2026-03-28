import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';

describe('RegistrationController', () => {
  let controller: RegistrationController;

  const mockRegistrationService = {
    startOrResume: jest.fn(),
    verifyMfa: jest.fn(),
    updateAddress: jest.fn(),
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
});