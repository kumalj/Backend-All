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
// import { CrPrototypeModule } from './cr-prototype/cr-prototype.module';
import { GetCrModule } from './getcr/getcr.module';
import { CRPrototypeModule } from './crprototype/crprototype.module';
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
      entities: [User, CR, Getcr,CRPrototype],
      synchronize: true,
      }),
      UserModule,
      JwtModule.register({
        secret: 'pass@123', 
        signOptions: { expiresIn: '1h' },
      }),
      UserModule,
      ChngerequestModule,
      // CrPrototypeModule,
      GetCrModule,
      CRPrototypeModule,
      MailModule,
      
      
      
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}