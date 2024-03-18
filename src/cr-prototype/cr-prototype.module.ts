import { Module } from '@nestjs/common';
import { CrPrototypeService } from './cr-prototype.service';
import { CrPrototypeController } from './cr-prototype.controller';

@Module({
  controllers: [CrPrototypeController],
  providers: [CrPrototypeService],
})
export class CrPrototypeModule {}
