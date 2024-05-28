import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    // Get email configuration from ConfigService
    const mailConfig = this.configService.get('email');

    // Assuming emailConfig properly returns the expected object structure
    this.transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure, 
      auth: mailConfig.auth,
    });
  }



async sendEmail(to: string, subject: string, body: string, fireEventAndForget: boolean = false) {
  const mailOptions = {
    from: 'focus.cblgroup@cbllk.com',
    to,
    subject,
    html: body,
  };

  if (fireEventAndForget) {
    this.transporter.sendMail(mailOptions).catch(error => {
      console.error('Error sending email:', error);

    });
  } else {
    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}

}
