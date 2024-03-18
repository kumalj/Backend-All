import { Module } from '@nestjs/common';
import { CRPrototypeService } from './cr-prototype.service';
import { CrPrototypeController } from './cr-prototype.controller';

@Module({
  controllers: [CrPrototypeController],
  providers: [CRPrototypeService],
})
export class CrPrototypeModule {}
  