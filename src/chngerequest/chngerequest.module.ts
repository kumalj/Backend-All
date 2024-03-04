

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CR } from './chngerequest.entity';
import { CrController } from './chngerequest.controller';
import { CrService } from './chngerequest.service';



@Module({
  imports: [TypeOrmModule.forFeature([CR])],
  controllers: [CrController],
  providers: [CrService],
})
export class ChngerequestModule {}
