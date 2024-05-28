/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ChngerequestModule } from './chngerequest/chngerequest.module';
import { CR } from './chngerequest/chngerequest.entity';
import { Getcr } from './getcr/getcr.entity';
import { CRPrototype } from './crprototype/crprototype.entity';
import { GetCrModule } from './getcr/getcr.module';
import { CRPrototypeModule } from './crprototype/crprototype.module';
import { ConfigModule } from '@nestjs/config';
import mailConfig from './mail/mail.config'; 
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'crms',
      entities: [User, CR, Getcr, CRPrototype],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      load: [mailConfig], 
    }),
    UserModule,
    JwtModule.register({
      secret: 'pass@123',
      signOptions: { expiresIn: '5h' },
    }),
    ChngerequestModule,
    GetCrModule,
    CRPrototypeModule,
    MailModule,
  ],
})
export class AppModule {}
