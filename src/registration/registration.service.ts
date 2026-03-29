import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Not, IsNull } from 'typeorm';
import { Registration } from './entities/registration.entity';
import { RegistrationStep } from './entities/registration-step.enum';
import { StartRegistrationDto } from './dto/start-registration.dto';
import { VerifyMfaDto } from './dto/verify-mfa.dto';
import {
  MAIL_PROVIDER,
  type IMailProvider,
} from '../providers/mail.provider.interface';
import {
  CEP_PROVIDER,
  type ICepProvider,
} from '../providers/cep.provider.interface';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration)
    private readonly registrationRepository: Repository<Registration>,

    @Inject(MAIL_PROVIDER)
    private readonly mailProvider: IMailProvider,

    @Inject(CEP_PROVIDER)
    private readonly cepProvider: ICepProvider,
  ) {}

  async startOrResume(dto: StartRegistrationDto) {
    const existingRegistration = await this.registrationRepository.findOne({
      where: { email: dto.email },
    });

    if (
      existingRegistration &&
      existingRegistration.currentStep === RegistrationStep.COMPLETED
    ) {
      throw new BadRequestException(
        'Este e-mail já possui um cadastro concluído.',
      );
    }

    if (existingRegistration) {
      const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();

      existingRegistration.mfaCode = mfaCode;
      existingRegistration.name = dto.name;

      await this.registrationRepository.save(existingRegistration);

      const emailBody = `Olá ${dto.name}, notamos que você não concluiu seu cadastro. Seu código de retorno é: <b>${mfaCode}</b>`;
      await this.mailProvider.sendEmail(
        dto.email,
        'Continue seu cadastro!',
        emailBody,
      );

      return {
        message:
          'Cadastro incompleto encontrado. Enviamos um código MFA para seu e-mail.',
        requireMfa: true,
      };
    }

    const newRegistration = this.registrationRepository.create({
      name: dto.name,
      email: dto.email,
      currentStep: RegistrationStep.DOCUMENT,
    });

    const saved = await this.registrationRepository.save(newRegistration);

    return {
      message: 'Cadastro iniciado com sucesso.',
      requireMfa: false,
      registrationId: saved.id,
      nextStep: saved.currentStep,
    };
  }

  async verifyMfa(dto: VerifyMfaDto) {
    const registration = await this.registrationRepository.findOne({
      where: { email: dto.email },
    });

    if (!registration) {
      throw new NotFoundException('Cadastro não encontrado.');
    }

    if (registration.mfaCode !== dto.code) {
      throw new BadRequestException('Código MFA inválido.');
    }

    registration.mfaCode = null;
    await this.registrationRepository.save(registration);

    return {
      message: 'MFA validado com sucesso. Bem-vindo de volta.',
      registrationId: registration.id,
      currentStep: registration.currentStep,
      data: registration,
    };
  }

  async updateAddress(
    id: string,
    zipCode: string,
    number: string,
    complement: string,
  ) {
    const registration = await this.registrationRepository.findOne({
      where: { id },
    });
    if (!registration) throw new NotFoundException('Cadastro não encontrado.');

    const addressData = await this.cepProvider.getAddress(zipCode);
    if (!addressData) {
      throw new BadRequestException('CEP inválido ou não encontrado.');
    }

    registration.zipCode = zipCode;
    registration.street = addressData.street;
    registration.neighborhood = addressData.neighborhood;
    registration.city = addressData.city;
    registration.state = addressData.state;
    registration.number = number;
    registration.complement = complement;

    registration.currentStep = RegistrationStep.COMPLETED;
    registration.finishedAt = new Date();

    return this.registrationRepository.save(registration);
  }

  async updateDocument(id: string, document: string) {
    const registration = await this.registrationRepository.findOne({
      where: { id },
    });
    if (!registration) throw new NotFoundException('Cadastro não encontrado.');

    registration.document = document;
    registration.currentStep = RegistrationStep.CONTACT; // Avança para o próximo passo

    return this.registrationRepository.save(registration);
  }

  async updateContact(id: string, phone: string) {
    const registration = await this.registrationRepository.findOne({
      where: { id },
    });
    if (!registration) throw new NotFoundException('Cadastro não encontrado.');

    registration.phone = phone;
    registration.currentStep = RegistrationStep.ADDRESS; // Avança para o próximo passo

    return this.registrationRepository.save(registration);
  }

  private readonly logger = new Logger(RegistrationService.name);

  @Cron(CronExpression.EVERY_HOUR)
  async handleAbandonmentEmails() {
    this.logger.log('Buscando cadastros abandonados...');

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const abandonedRegistrations = await this.registrationRepository.find({
      where: {
        currentStep: Not(RegistrationStep.COMPLETED),
        lastUpdatedAt: LessThan(oneHourAgo),
        abandonmentEmailSentAt: IsNull(),
      },
    });

    for (const reg of abandonedRegistrations) {
      const emailBody = `Olá ${reg.name}, vimos que você parou na etapa de cadastro. Volte e conclua para aproveitar nossos serviços!`;

      await this.mailProvider.sendEmail(
        reg.email,
        'Continue seu cadastro conosco!',
        emailBody,
      );

      reg.abandonmentEmailSentAt = new Date();
      await this.registrationRepository.save(reg);

      this.logger.log(`E-mail de abandono enviado para: ${reg.email}`);
    }
  }
}
