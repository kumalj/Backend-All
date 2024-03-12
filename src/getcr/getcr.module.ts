import { Module } from '@nestjs/common';
import { GetCrService } from './getcr.service';
import { GetCrController } from './getcr.controller';

@Module({
  controllers: [GetCrController],
  providers: [GetCrService],
})
export class GetCrModule {}
