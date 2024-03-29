/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    // Get email configuration from ConfigService
   // const emailConfig = this.configService.get('email');

    // Create Nodemailer transporter with the provided configuration
    this.transporter = nodemailer.createTransport({
      service: '',
      auth: {
        user: '',
        pass: '',
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string) {
    const mailOptions = {
      from: this.configService.get('email.auth.user'),
      to,
      subject,
      html: body,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
