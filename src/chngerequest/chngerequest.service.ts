// src/cat.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CR } from './chngerequest.entity';


@Injectable()
export class CrService {
  constructor(
    @InjectRepository(CR)
    private readonly CrRepository: Repository<CR>,
  ) {}

  async findAll(): Promise<CR[]> {
    return await this.CrRepository.find();
  }

  async startDevelopment(crId: number): Promise<CR> {
    const cr = await this.CrRepository.findOne({ where: { crId } }); // Use 'id' instead of 'crId'
    if (cr) {
      cr.status = 'Starting Development'; // Update the CR status
      return this.CrRepository.save(cr);
    } else {
      throw new Error(`CR with ID ${crId} not found`);
    }
  }
  

  async findByStatus(status: string): Promise<CR[]> {
    return this.CrRepository.find({ where: { status } });
  }
  

  async create(cr: CR): Promise<CR> {
    return await this.CrRepository.save(cr);
  }



  async update(crId: number, cr: CR): Promise<CR> {
    await this.CrRepository.update(crId, cr);
    return await this.CrRepository.findOne({ where: { crId } });
  }

  async delete(crId: number): Promise<void> {
    await this.CrRepository.delete(crId);
  }

  async updatePriority(crId: number, priority: string): Promise<CR> {
    const cr = await this.CrRepository.findOne({ where: { crId } });
    cr.priority = priority;
    return await this.CrRepository.save(cr);
}

}
