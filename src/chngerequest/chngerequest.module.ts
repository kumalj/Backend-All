

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CR } from './chngerequest.entity';
import { CrController } from './chngerequest.controller';
import { CrService } from './chngerequest.service';
import { JwtModule } from '@nestjs/jwt';



@Module({
  imports: [
    TypeOrmModule.forFeature([CR]),
    JwtModule.register({
      secret: 'pass@123',
      signOptions: { expiresIn: '1m' },
    }),
    // Other modules...
  ],
  controllers: [CrController],
  providers: [CrService],
})
export class ChngerequestModule {}
