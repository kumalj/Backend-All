/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CR } from './chngerequest.entity';
import { CrController } from './chngerequest.controller';
import { CrService } from './chngerequest.service';
import { Getcr } from '../getcr/getcr.entity'; 
import { User } from '../user/user.entity';
import { CRPrototype } from 'src/crprototype/crprototype.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CR, Getcr, User,CRPrototype]),
    JwtModule.register({
      secret: 'pass@123',
      signOptions: { expiresIn: '5h' },
    }),
    MulterModule.register({
      dest: './uploads', 
    }),
    ServeStaticModule.forRoot({
      rootPath: join( 'uploads'), 
      serveRoot: '/uploads', 
    }),MailModule
  ],
  controllers: [CrController],
  providers: [CrService],
})
export class ChngerequestModule {}
