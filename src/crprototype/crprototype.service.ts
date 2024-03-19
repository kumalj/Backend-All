// crprototype.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CRPrototype } from './crprototype.entity';

@Injectable()
export class CRPrototypeService {
  constructor(
    @InjectRepository(CRPrototype)
    private readonly crPrototypeRepository: Repository<CRPrototype>,
  ) {}

  async createCRPrototype(crPrototypeData: Partial<CRPrototype>): Promise<CRPrototype> {
    const crPrototype = this.crPrototypeRepository.create(crPrototypeData);
    return this.crPrototypeRepository.save(crPrototype);
  }
}
