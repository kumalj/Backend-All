

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CR } from './chngerequest.entity';
import { CrController } from './chngerequest.controller';
import { CrService } from './chngerequest.service';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { Getcr } from 'src/getcr/getcr.entity'; 
import { User } from 'src/user/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([CR, Getcr, User]),
    JwtModule.register({
      secret: 'pass@123',
      signOptions: { expiresIn: '1h' },
    }),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [CrController],
  providers: [CrService],
})
export class ChngerequestModule {}
