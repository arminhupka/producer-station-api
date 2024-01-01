import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  sendRegistrationConfirm(email: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: 'Registration confirm',
      template: './registration-confirm',
    });
  }

  sendAccountActivationConfirm(email: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: 'Account Activation Confirm',
      template: './account-activation-confirm',
    });
  }

  sendRequestResetPasswordToken(email: string, token: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: 'Request Reset Password Token',
      template: './request-reset-password-token',
      context: {
        token,
      },
    });
  }

  sendDeleteAccountConfirm(email: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: 'Delete account confirm',
      template: './delete-account-confirm',
    });
  }

  sendNewLabelNotification(labelName: string) {
    return this.mailerService.sendMail({
      to: this.configService.get<string>('APP_ADMIN_EMAIL'),
      subject: 'New Label Created',
      template: './new-label-created',
      context: {
        name: labelName,
      },
    });
  }

  sendLabelActivatedNotification(email: string, label: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: `Label ${label} activated`,
      template: './label-activated-notification',
      context: {
        label,
      },
    });
  }

  sendLabelSuspendedNotification(email: string, label: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: `Label ${label} suspended`,
      template: './label-suspended-notification',
      context: {
        label,
      },
    });
  }
}
