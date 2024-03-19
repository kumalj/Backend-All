// crprototype.service.ts

import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CRPrototype } from './crprototype.entity';

@Injectable()
export class CrPrototypeService {
  constructor(
    @InjectRepository(CRPrototype)
    private readonly crPrototypeRepository: Repository<CRPrototype>,
  ) {}

  async create(crPrototypeData: CRPrototype): Promise<CRPrototype> {
    return this.crPrototypeRepository.save(crPrototypeData);
  }

  
  async findAll(): Promise<CRPrototype[]> {
    return await this.crPrototypeRepository.find();
  }

  async findOne(prId: number): Promise<CRPrototype> {
    const crPrototype = await this.crPrototypeRepository.findOne({ where: {prId } });
    if (!crPrototype) {
      throw new NotFoundException('CR prototype not found');
    }
    return crPrototype;
  }
}
