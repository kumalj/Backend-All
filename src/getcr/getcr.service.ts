import { Injectable } from '@nestjs/common';
import { CreateGetCrDto } from './dto/create-getcr.dto';
import { UpdateGetCrDto } from './dto/update-getcr.dto';
import { Getcr } from './getcr.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class GetCrService {
  create(createDdDto: CreateGetCrDto) {
    return 'This action adds a new dd';
  }
  findAll() {
    return `This action returns all crPrototype`;
  }

  findOne(id: number) {
    return `This action returns a #${id} crPrototype`;
  }

  update(id: number, updateCrPrototypeDto: UpdateGetCrDto) {
    return `This action updates a #${id} crPrototype`;
  }

  remove(id: number) {
    return `This action removes a #${id} crPrototype`;
  }
}
