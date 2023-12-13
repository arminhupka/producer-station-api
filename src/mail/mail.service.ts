import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  sendRegistrationConfirm() {
    return this.mailerService.sendMail({
      subject: 'Registration confirm',
      template: '/registration-confirm',
    });
  }
}
