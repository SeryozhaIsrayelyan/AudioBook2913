import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Query } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(email: string, verificationCode: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Verification Message',
      template: '/email',
      context: {
        verificationCode: verificationCode,
      },
    });
    return 1;
  }

  async sendMailNEW(email: string) {
    // await this.mailerService.sendMail({
    //   to: email,
    //   subject: 'Email Verification Message',
    //   template: '/email',
    //   context: {
    //     verificationCode: verificationCode,
    //   },
    // });
    
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;

    const mailgun = require('mailgun-js')({ domain, apiKey });

    mailgun.
      messages().
      send({
        from: `test@${domain}`,
          to: email,
          subject: 'Hello from Mailgun',
          text: 'This is a test'
      }).
      then(res => console.log(res)).
      catch(err => console.log(err));

   

    return 1;
  }
  
}
