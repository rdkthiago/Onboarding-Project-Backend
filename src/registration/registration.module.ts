import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { Registration } from './entities/registration.entity';
import { CEP_PROVIDER } from '../providers/cep.provider.interface';
import { ViaCepProvider } from '../providers/viacep.provider';
import { MAIL_PROVIDER } from '../providers/mail.provider.interface';
import { ResendMailProvider } from '../providers/resend-mail.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Registration])],
  controllers: [RegistrationController],
  providers: [
    RegistrationService,
    {
      provide: CEP_PROVIDER,
      useClass: ViaCepProvider,
    },
    {
      provide: MAIL_PROVIDER,
      useClass: ResendMailProvider,
    },
  ],
})
export class RegistrationModule {}
