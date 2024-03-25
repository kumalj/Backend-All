/* eslint-disable prettier/prettier */
// crprototype.service.ts

import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CRPrototype } from './crprototype.entity';
import { CR } from 'src/chngerequest/chngerequest.entity';

@Injectable()
export class CrPrototypeService {
  constructor(
    @InjectRepository(CRPrototype)
    private readonly crPrototypeRepository: Repository<CRPrototype>,
    @InjectRepository(CR)
    private readonly crRepository: Repository<CR>,
  ) {}

  async create(crPrototypeData: CRPrototype): Promise<CRPrototype> {
    return this.crPrototypeRepository.save(crPrototypeData);
  }

  async uploadFile(crPrototypeData: CRPrototype, randomName: string): Promise<CRPrototype> {
    const filePath = '/uploads/prototype/' + randomName; // Use the provided randomName in the file path
    crPrototypeData.filePath = filePath; // Assign the file path to the CR object
  
    // Save the CR
    const createdCR = await this.crPrototypeRepository.save(crPrototypeData);
    return createdCR;
  }

  
  // async findAll(): Promise<CRPrototype[]> {
  //   return await this.crPrototypeRepository.find({ relations: ['cr','cr.userId'] });

    async findAll(): Promise<CRPrototype[]> {
      return await this.crPrototypeRepository.find({ 
        relations: ['cr', 'cr.userId'] 
      });
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

  async completeTask(prId: number): Promise<void> {
    // Update the status of CRPrototype
    await this.crPrototypeRepository.update(prId, { popupstatus: 'Completed' });

    // Retrieve the CR associated with this CRPrototype
    const crPrototype = await this.crPrototypeRepository.findOne({where:{prId}});
    const crId = crPrototype.crId;

    // Update the status of the corresponding CR
    await this.crRepository.update(crId, { status: 'Completed' });
  }

  async updatePopupStatus(crId: number, popupstatus: string): Promise<void> {
    const crPrototype = await this.crPrototypeRepository.findOne({ where: { crId } });
    if (!crPrototype) {
      throw new NotFoundException('CR prototype not found');
    }
    crPrototype.popupstatus = popupstatus;
    await this.crPrototypeRepository.save(crPrototype);
  }
  
}
