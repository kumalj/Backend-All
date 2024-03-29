/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [ConfigModule], // Import ConfigModule here
  providers: [MailService, ConfigService], // Include ConfigService as a provider
  exports: [MailService], // Export MailService if needed in other modules
})
export class MailModule {}
