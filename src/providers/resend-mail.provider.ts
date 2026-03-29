import { Injectable } from '@nestjs/common';
import { IMailProvider } from './mail.provider.interface';

@Injectable()
export class ResendMailProvider implements IMailProvider {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn('RESEND_API_KEY not found. Simulating sending an email...');
      console.log(`[SIMULATED E-MAIL] TO: ${to} | SUBJECT: ${subject}`);
      return;
    }

    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to,
          subject,
          html: body,
        }),
      });
    } catch (error) {
      console.error('Failed to send the e-mail in Resend:', error);
    }
  }
}
