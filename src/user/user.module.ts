/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; 
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from 'src/mail/mail.module';
import { CR } from 'src/chngerequest/chngerequest.entity';
import { Getcr } from 'src/getcr/getcr.entity';
import { CRPrototype } from 'src/crprototype/crprototype.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CR, Getcr, User,CRPrototype]),
    JwtModule.register({
      secret: 'pass@123',
      signOptions: { expiresIn: '5h' },
    }),MailModule

  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], 
})
export class UserModule {}
