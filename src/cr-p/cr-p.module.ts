// cr-p.module.ts

import { CrpService } from './cr-p.service'; // Fix the case here
import { CrpController } from './cr-p.controller'; // Fix the case here
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crp } from './cr-p.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Crp])],
  controllers: [CrpController],
  providers: [CrpService],
})
export class CrpModule {}
