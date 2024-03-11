/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ChngerequestModule } from './chngerequest/chngerequest.module';
import { CR } from './chngerequest/chngerequest.entity';


import { AdminModule } from './admin/admin.module';
import { ChangeRequestService } from './change-request/change-request.service';
import { ChangeRequestController } from './change-request/change-request.controller';




@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'crms',
      entities: [User, CR,],
      synchronize: true,
      }),
      UserModule,
      JwtModule.register({
        secret: 'pass@123', 
        signOptions: { expiresIn: '1h' },
      }),
      UserModule,
      ChngerequestModule,
      AdminModule,
      
      
  ],
  providers: [ChangeRequestService],
  controllers: [ChangeRequestController],
})
export class AppModule {}