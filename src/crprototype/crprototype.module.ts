/* eslint-disable prettier/prettier */
// crprototype.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CRPrototype } from './crprototype.entity';
import { CrPrototypeService } from './crprototype.service';
import { CrPrototypeController } from './crprototype.controller';
import { CR } from 'src/chngerequest/chngerequest.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Getcr } from 'src/getcr/getcr.entity';
import { User } from 'src/user/user.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([CR, Getcr, User,CRPrototype]),
  MulterModule.register({
    dest: './uploads', // Specify the destination directory for file uploads
  }),
  ServeStaticModule.forRoot({
    rootPath: join( 'uploads'), // Specify the directory path to serve static files from
    serveRoot: '/uploads', // Specify the root URL path for serving static files
  }),MailModule
],
  providers: [CrPrototypeService],
  controllers: [CrPrototypeController],
})
export class CRPrototypeModule {}
