// crprototype.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CRPrototype } from './crprototype.entity';
import { CrPrototypeService } from './crprototype.service';
import { CrPrototypeController } from './crprototype.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CRPrototype])],
  providers: [CrPrototypeService],
  controllers: [CrPrototypeController],
})
export class CRPrototypeModule {}
