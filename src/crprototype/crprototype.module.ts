// crprototype.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CRPrototype } from './crprototype.entity';
import { CrPrototypeService } from './crprototype.service';
import { CrPrototypeController } from './crprototype.controller';
import { CR } from 'src/chngerequest/chngerequest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CRPrototype, CR])],
  providers: [CrPrototypeService],
  controllers: [CrPrototypeController],
})
export class CRPrototypeModule {}
