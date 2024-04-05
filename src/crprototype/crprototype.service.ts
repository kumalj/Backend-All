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
    const crId = crPrototype.crId;
    if (!crPrototype) {
      throw new NotFoundException('CR prototype not found');
    }
    const cr = await this.crRepository.findOne({ where: { crId: crPrototype.crId }, relations: ['userId'] });
    crPrototype.popupstatus = 'Approved';
    await this.crRepository.update(crId, { status: 'Prototype Approved' });
//     const userEmail = await this.cr(crId); // Fetch user's email
//     await this.emailService.sendEmail(
//       userEmail,
//      `Your CR Request has been ${hodApproval}!`,
//       `Dear ${cr.userId.firstname} ${cr.userId.lastname},

// We're excited to inform you that your Change Request (CR) has been ${hodApproval} by the Head of Department (HOD).

// Change Request Details:
// - CR ID: ${crId}
// - Title: ${cr.topic}
// - CR Priority: ${cr.priority}
// - Status: ${hodApproval}

// Your requested changes are now approved and will be implemented accordingly. 

// If you have any further questions or need assistance, feel free to contact us.

// Best regards,
// IT Team`,
//    );
    return await this.crPrototypeRepository.save(crPrototype);
  }

  async secondpr(prId: number): Promise<CRPrototype> {
    const crPrototype = await this.crPrototypeRepository.findOne({where:{ prId}});
    const crId = crPrototype.crId;
    if (!crPrototype) {
      throw new NotFoundException('CR prototype not found');
    }
    await this.crRepository.update(crId, { status: 'Send Another Prototype' });
    return await this.crPrototypeRepository.save(crPrototype);
  }

  async reject(prId: number, reason: string): Promise<CRPrototype> {
    const crPrototype = await this.crPrototypeRepository.findOne({where: {prId}});
    const cr = await this.crRepository.findOne({where: {crId: crPrototype.crId}}); 
    if (!crPrototype) {
      throw new NotFoundException('CR prototype not found');
    }
    cr.status = 'Prototype Rejected';
    crPrototype.popupstatus = 'Rejected';
    crPrototype.rejectionReason = reason;
    
  return await this.crPrototypeRepository.save(crPrototype);
  }

  async updateCRPrototype(prId: number, updateData: Partial<CRPrototype>): Promise<void> {
    await this.crPrototypeRepository.update({ prId }, updateData);
  }

  // async completeTask(prId: number): Promise<void> {
  //   // Update the status of CRPrototype
  //   //await this.crPrototypeRepository.update(prId, { popupstatus: 'Completed' });

  

  //   // Retrieve the CR associated with this CRPrototype
  //   const crPrototype = await this.crPrototypeRepository.findOne({where:{prId}});
  //   const crId = crPrototype.crId;

  //   // Update the status of the corresponding CR
  //   await this.crRepository.update(crId, { status: 'Completed' });
  // }

  async uatapprovel(prId: number): Promise<void> {

    const crPrototype = await this.crPrototypeRepository.findOne({where:{prId}});
    const crId = crPrototype.crId;
    await this.crRepository.update(crId, { status: 'Need UAT Approvel' });
  }

  async afteruatapprovel(prId: number): Promise<void> {
    // Update the status of CRPrototype
    //await this.crPrototypeRepository.update(prId, { popupstatus: 'Development Completed' });

  

    // Retrieve the CR associated with this CRPrototype
    const crPrototype = await this.crPrototypeRepository.findOne({where:{prId}});
    const crId = crPrototype.crId;

    // Update the status of the corresponding CR
    await this.crRepository.update(crId, { status: 'Development Completed' });
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
