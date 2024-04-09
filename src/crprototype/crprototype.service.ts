/* eslint-disable prettier/prettier */
// crprototype.service.ts

import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CRPrototype } from './crprototype.entity';
import { CR } from 'src/chngerequest/chngerequest.entity';
import { MailService } from 'src/mail/mail.service';
import { Getcr } from 'src/getcr/getcr.entity';

@Injectable()
export class CrPrototypeService {
  constructor(
    @InjectRepository(CRPrototype)
    private readonly crPrototypeRepository: Repository<CRPrototype>,
    @InjectRepository(CR)
    private readonly crRepository: Repository<CR>,
    private emailService: MailService,
    @InjectRepository(Getcr)
    private readonly getCrRepository: Repository<Getcr>,


  ) {}

  async create(crPrototypeData: CRPrototype): Promise<CRPrototype> {

    const userEmail = await this.getUserUsernameForCR(crPrototypeData.crId); // Fetch user's email
    await this.emailService.sendEmail(
      userEmail,
      `Your CR Request Get To Development!`,
      `Dear ${userEmail}, 
       <p> Your CR Request has a prototype. Please check it.

       Best regards,
       IT Team`,
       true,
    );

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


  async approve(prId: number, getCrData: Getcr): Promise<CRPrototype> {
    const crPrototype = await this.crPrototypeRepository.findOne({where: {prId}});
    if (!crPrototype) {
      throw new NotFoundException('CR prototype not found');
    }
    // This line should come after checking crPrototype is not null
    const crId = crPrototype.crId;
  
    const cr = await this.crRepository.findOne({ where: { crId }, relations: ['userId'] });
    if (!cr || !cr.userId) {
      throw new NotFoundException('CR or associated user not found');
    }
  
    // Update CR prototype status
    crPrototype.popupstatus = 'Approved';
    await this.crPrototypeRepository.save(crPrototype);
  
    // Update related CR status
    await this.crRepository.update(crId, { status: 'Prototype Approved' });
  
    // Assuming getUserUsernameForCR returns an email, consider fetching the user's name for a personalized email
    const userEmail = await this.getDevUserUsernameForCR(getCrData.getid);
    
    // If you have the user's name, use it. Otherwise, fall back to the email.
    const userName =  userEmail; // Adjust according to your actual user entity
  
    await this.emailService.sendEmail(
      userEmail,
      `Your CR Request Gets to Development!`,
      `Dear ${userName}, 
       <p>Your prototype has been approved.</p>
  
       Best regards,
       IT Team`,
       true,
    );
  
    return crPrototype;
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

  async reject(prId: number, reason: string,getCrData: Getcr): Promise<CRPrototype> {
    const crPrototype = await this.crPrototypeRepository.findOne({where: {prId}});
    const cr = await this.crRepository.findOne({where: {crId: crPrototype.crId}}); 
    if (!crPrototype) {
      throw new NotFoundException('CR prototype not found');
    }
    cr.status = 'Prototype Rejected';
    crPrototype.popupstatus = 'Rejected';
    crPrototype.rejectionReason = reason;

    const userEmail = await this.getDevUserUsernameForCR(getCrData.getid);
    
    // If you have the user's name, use it. Otherwise, fall back to the email.
    const userName =  userEmail; // Adjust according to your actual user entity
  
    await this.emailService.sendEmail(
      userEmail,
      `Your CR Request Gets to Development!`,
      `Dear ${userName}, 
       <p>Your prototype has been rejected.</p>
       <p>Reason: ${reason}</p>
  
       Best regards,
       IT Team`,
       true,
    );
    
  return await this.crPrototypeRepository.save(crPrototype);
  }

  async updateCRPrototype(prId: number, updateData: Partial<CRPrototype>): Promise<void> {
    await this.crPrototypeRepository.update({ prId }, updateData);
  }


  async uatapprovel(prId: number): Promise<void> {

    const crPrototype = await this.crPrototypeRepository.findOne({where:{prId}});
    const crId = crPrototype.crId;
    const userEmail = await this.getUserUsernameForCR(crId) && 'trainingitasst.cbl@cbllk.com'; 
    await this.emailService.sendEmail(
      userEmail,                   // user email and hod email
      `Your CR Request Get To Development!`,
      `Dear User, 
        <p>CR Request Need UAT Approvel.</p>

       Best regards,
       IT Team`,
       true,
    );
    await this.crRepository.update(crId, { status: 'Need UAT Approvel' });
  }

  async afteruatapprovel(prId: number): Promise<void> {

    // Retrieve the CR associated with this CRPrototype
    const crPrototype = await this.crPrototypeRepository.findOne({where:{prId}});
    const crId = crPrototype.crId;

        const userEmail = await this.getUserUsernameForCR(crId) && 'trainingitasst.cbl@cbllk.com'; // User email and HOD email
    await this.emailService.sendEmail(
      userEmail,                   
      `Your CR Request Get To Development!`,
      `Dear User, 
        <p>Development Completed.</p>

       Best regards,
       IT Team`,
       true,
    );

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

  async getDevUserUsernameForCR(getId: number): Promise<string> {
    // Ensure the repository is correctly injected and used here
    const getcrRecord = await this.getCrRepository.findOneOrFail({
      where: { getid: getId }, // Making sure 'getid' matches the column name in your database
      relations: ['user'], // This should match the property name in the Getcr entity
    });
  
    if (!getcrRecord || !getcrRecord.user) {
      throw new Error(`Getcr record with ID ${getId} not found or associated user not found`);
    }
  
    return getcrRecord.user.username;
  }

  async getUserUsernameForCR(crId: number): Promise<string> {
    const cr = await this.crRepository.findOneOrFail({
      where: { crId },
      relations: ['userId'],
    });
    if (!cr || !cr.userId || !cr.userId.username) {
      throw new Error(
        `CR with ID ${crId} not found or associated user not found`,
      );
    }
    return cr.userId.username;
  }
  
}
  

