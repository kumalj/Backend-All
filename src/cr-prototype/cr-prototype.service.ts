import { Injectable } from '@nestjs/common';
import { CreateCrPrototypeDto } from './dto/create-cr-prototype.dto';
import { UpdateCrPrototypeDto } from './dto/update-cr-prototype.dto';
import { CRPrototype } from './cr-prototype.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CrPrototypeService {
    constructor(
        @InjectRepository(CRPrototype)
        private readonly prototypeRepository: Repository<CRPrototype>,
    ) {}

    


  create(createCrPrototypeDto: CreateCrPrototypeDto) {
    return 'This action adds a new crPrototype';
  }

  findAll() {
    return `This action returns all crPrototype`;
  }

  findOne(id: number) {
    return `This action returns a #${id} crPrototype`;
  }

  update(id: number, updateCrPrototypeDto: UpdateCrPrototypeDto) {
    return `This action updates a #${id} crPrototype`;
  }

  remove(id: number) {
    return `This action removes a #${id} crPrototype`;
  }
}
