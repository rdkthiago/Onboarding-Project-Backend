import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { StartRegistrationDto } from './dto/start-registration.dto';
import { VerifyMfaDto } from './dto/verify-mfa.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('registration')
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Post('start')
  async startOrResume(@Body() startRegistrationDto: StartRegistrationDto) {
    return this.registrationService.startOrResume(startRegistrationDto);
  }

  @Post('verify-mfa')
  async verifyMfa(@Body() verifyMfaDto: VerifyMfaDto) {
    return this.registrationService.verifyMfa(verifyMfaDto);
  }

  @Patch(':id/address')
  async updateAddress(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.registrationService.updateAddress(
      id,
      updateAddressDto.zipCode,
      updateAddressDto.number,
      updateAddressDto.complement,
    );
  }

  @Patch(':id/document')
  async updateDocument(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.registrationService.updateDocument(
      id,
      updateDocumentDto.document,
    );
  }

  @Patch(':id/contact')
  async updateContact(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.registrationService.updateContact(id, updateContactDto.phone);
  }
}
