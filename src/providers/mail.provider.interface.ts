export const MAIL_PROVIDER = 'IMailProvider';

export interface IMailProvider {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}