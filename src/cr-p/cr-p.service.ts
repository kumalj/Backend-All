

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Crp } from './cr-p.entity';

@Injectable()
export class CrpService {
  constructor(
    @InjectRepository(Crp)
    private readonly crpRepository: Repository<Crp>,
  ) {}

  async create(crp: Crp): Promise<Crp> {
    return this.crpRepository.save(crp);
  }

  async update(id: number, updatedCrp: Crp): Promise<Crp | undefined> {
    await this.crpRepository.update(id, updatedCrp);
    return this.crpRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.crpRepository.delete(id);
  }

  async findOne(id: number): Promise<Crp | undefined> {
    return this.crpRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Crp[]> {
    return this.crpRepository.find();
  }
}
