// crprototype.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CRPrototype } from './crprototype.entity';
import { CRPrototypeService } from './crprototype.service';
import { CRPrototypeController } from './crprototype.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CRPrototype])],
  providers: [CRPrototypeService],
  controllers: [CRPrototypeController],
})
export class CRPrototypeModule {}
