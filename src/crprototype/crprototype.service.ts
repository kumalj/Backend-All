/* eslint-disable prettier/prettier */


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

        const userEmail = await this.getUserUsernameForCR(crPrototypeData.crId); 
    await this.emailService.sendEmail(
      userEmail,
      `Your Change Request now has a Prototype`,
      `<p><h2>Change Request Prototype Ready</h2></p> 
       <p> Your Change Request now has a prototype.</p>
         <ul>

             <li><strong>CrId : </strong> ${crPrototypeData.crId}</li>
             <li><strong>Topic : </strong> ${crPrototypeData.topic}</li>
             <li><strong>Estimated Delivery Date : </strong> ${crPrototypeData.estimatedDate}</li>

          </ul>
       <p>Please login to the Change Request Management System to view more details.</p>

       <p>Thank You!</p>`,
       true,
    );
    

    const { crId } = crPrototypeData;
  

    await this.crRepository.update(crId, { ProtoCreatedAt: new Date() });
  

    return this.crPrototypeRepository.save(crPrototypeData);
  }
  

  async uploadFile(crPrototypeData: CRPrototype, randomName: string): Promise<CRPrototype> {
    const filePath = '/uploads/prototype/' + randomName; // Use the provided randomName in the file path
    crPrototypeData.filePath = filePath; // Assign the file path to the CR object
  


    const createdCR = await this.crPrototypeRepository.save(crPrototypeData);
    return createdCR;
  }



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
    
    const crId = crPrototype.crId;
  
    const cr = await this.crRepository.findOne({ where: { crId }, relations: ['userId'] });
    if (!cr || !cr.userId) {
      throw new NotFoundException('CR or associated user not found');
    }
  
    // Update CR prototype status
    crPrototype.popupstatus = 'Approved';
    await this.crRepository.update(crId, { prototypeApproveAt : new Date() });
    await this.crPrototypeRepository.save(crPrototype);
  

    await this.crRepository.update(crId, { status: 'Prototype Approved' });
  
    const userEmail = await this.getDevUserUsernameForCR(getCrData.getid);
    await this.emailService.sendEmail(
      userEmail,
      `Your Prototype has been Approved!`,
      `<p><h2>Prototype Approval</h2></p> 
       <p>The prototype you made now has been approved.</p>
       <ul>

       <li><strong>CrId : </strong> ${crPrototype.crId}</li>
       <li><strong>Topic : </strong> ${crPrototype.topic}</li>

    </ul>
  
       <p>Thank You!</p>`,
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
    await this.crRepository.update(crId, { secondProtoCreatedAt : new Date() });
    await this.crRepository.update(crId, { status: 'Send Another Prototype' });
    const userEmail = await this.getUserUsernameForCR(crPrototype.crId); // Fetch user's email
    await this.emailService.sendEmail(
      userEmail,
      `Your Change Request now has a other prototype`,
      `<p><h2>Change Request Prototype Ready</h2></p> 
      <p> Your Change Request now has a other prototype.</p>
      <ul>

          <li><strong>CrId : </strong> ${crPrototype.crId}</li>
          <li><strong>Topic : </strong> ${crPrototype.topic}</li>
          <li><strong>Estimated Delivery Date : </strong> ${crPrototype.estimatedDate}</li>

       </ul>
    <p>Please login to the Change Request Management System to view more details.</p>

    <p>Thank You!</p>`,
       true,
    );
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
    await this.emailService.sendEmail(
      userEmail,
      `Your Prototype has been rejected!`,
      `<p><h2>Prototype Rejection</h2></p> 
       <p>The prototype you made has been rejected.</p>
       <ul>

       <li><strong>CrId : </strong> ${crPrototype.crId}</li>
       <li><strong>Topic : </strong> ${crPrototype.topic}</li>
       <li><strong>Rejection reason : </strong></li>${reason}</li>

    </ul>

  
       <p>Thank You!</p>`,
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
    const userEmail = await this.getUserUsernameForCR(crId) && 'trainingitasst.cbl@cbllk.com'; // user email and hod email
    await this.emailService.sendEmail(
      userEmail,        
      `Change Request Need UAT Approvel!`,
      `<p><h2>Change Request Requires UAT Approval</h2></p> 
        <p>Change Request Need UAT Approvel. Please make sure to view it from CR Management system. </p>
        <ul>

        <li><strong>CrId : </strong> ${crPrototype.crId}</li>
        <li><strong>Topic : </strong> ${crPrototype.topic}</li>

 
     </ul>

       <p>Thank You!</p>`,
       true,
    );
    await this.crRepository.update(crId, { needUatApprovelAt : new Date() });
    await this.crRepository.update(crId, { status: 'Need UAT Approvel' });
  }

  async afteruatapprovel(prId: number): Promise<void> {

    const crPrototype = await this.crPrototypeRepository.findOne({where:{prId}});
    const crId = crPrototype.crId;
    const userEmail = await this.getUserUsernameForCR(crId) && 'trainingitasst.cbl@cbllk.com'; // User email and HOD email
    await this.emailService.sendEmail(
      userEmail,                   
      `Your Change Request has been completed!`,
      `<p><h2> Change Request Completed</h2></p> 
        <p>We are pleased to inform you that your Change Request has been successfully completed.
        <ul>
        <li><strong>CrId : </strong> ${crPrototype.crId}</li>
        <li><strong>Topic : </strong> ${crPrototype.topic}</li>

        </ul>

        Please log in to the Change Request Management System to review the details and outcomes of the implementation.</p>

      <p>Thank You!</p>`,
       true,
    );
    
    await this.crRepository.update(crId, { devCompletedAt : new Date() });
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
    
    const getcrRecord = await this.getCrRepository.findOneOrFail({
      where: { getid: getId }, 
      relations: ['user'], 
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
  

