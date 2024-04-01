/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GetCrService } from './getcr.service';
import { GetCrController } from './getcr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CR } from 'src/chngerequest/chngerequest.entity';
import { Getcr } from './getcr.entity';
import { User } from 'src/user/user.entity';
import { CRPrototype } from 'src/crprototype/crprototype.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CR, Getcr, User,CRPrototype])],
  controllers: [GetCrController],
  providers: [GetCrService],
})
export class GetCrModule {}
