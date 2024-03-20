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

  async uploadFile(crPrototypeData: CRPrototype, randomName: string): Promise<CRPrototype> {
    const filePath = '/uploads/' + randomName; // Use the provided randomName in the file path
    crPrototypeData.filePath = filePath; // Assign the file path to the CR object
  
    // Save the CR
    const createdCR = await this.crPrototypeRepository.save(crPrototypeData);
    return createdCR;
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


  async approve(prId: number): Promise<CRPrototype> {
    const crPrototype = await this.crPrototypeRepository.findOne({where:{ prId}});
    if (!crPrototype) {
      throw new NotFoundException('CR prototype not found');
    }
    crPrototype.popupstatus = 'Approved';
    return await this.crPrototypeRepository.save(crPrototype);
  }

  async reject(prId: number, reason: string): Promise<CRPrototype> {
    const crPrototype = await this.crPrototypeRepository.findOne({where: {prId}}) ;
    if (!crPrototype) {
      throw new NotFoundException('CR prototype not found');
    }
    crPrototype.popupstatus = 'Rejected';
    crPrototype.rejectionReason = reason;
    return await this.crPrototypeRepository.save(crPrototype);
  }

  async updateCRPrototype(prId: number, updateData: Partial<CRPrototype>): Promise<void> {
    await this.crPrototypeRepository.update({ prId }, updateData);
  }
}
