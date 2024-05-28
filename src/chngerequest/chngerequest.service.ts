import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CR } from './chngerequest.entity';
import { Getcr } from '../getcr/getcr.entity';
import { User } from 'src/user/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class CrService {
  constructor(
    @InjectRepository(CR)
    private readonly CrRepository: Repository<CR>,
    private emailService: MailService,
    @InjectRepository(Getcr)
    private readonly GetCrRepository: Repository<Getcr>,
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) { }

  async findAll(): Promise<CR[]> {
    return await this.CrRepository.find({
      relations: ['userId', 'getCr', 'getCr.user', 'getCr.cr'],
      
    });
  }



  async startDevelopment(crId: number, userId: number): Promise<CR> {
    try {
      const cr = await this.CrRepository.findOne({ where: { crId } });
      if (!cr) {
        throw new Error(`CR with ID ${crId} not found`);
      }
  
      cr.status = 'Taken For Development';
  
      const user = await this.UserRepository.findOne({ where: { userId } });
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
      cr.developer = user.firstname + ' ' + user.lastname;
      cr.getToDevelopmentAt = new Date();
  
      await this.CrRepository.save(cr);

      const getcr = new Getcr();
      getcr.cr = cr;
      getcr.user = user;

      await this.GetCrRepository.save(getcr);
  
      // Update priorities
      await this.updatePriorities();
  
      // Send emails
      const userEmail = await this.getUserUsernameForCR(crId);
      await this.emailService.sendEmail(
        userEmail,
        `Your Change Request Get To Development!`,
        ` <p><h2>Change Request Moved to Development

        </h2></p>
          <p>Your CR Request Has been taken to development by the team!</p>
          <ul>

          <li><strong>Title:</strong> ${cr.topic}</li>
          <li><strong>Get to development by:</strong> ${cr.developer}</li>
        </ul>
  
        <p>Thank You!</p>`,
         true,
      );
  
      return cr;
    } catch (error) {
      console.error('Error in startDevelopment:', error);
      throw error; 
    }
  }
  

  async updatePriorities(): Promise<void> {
    // Get all CRs ordered by priority
    const crs = await this.CrRepository.find({ order: { priority: 'ASC' } });

    // Update priorities based on their order, starting from the first CR
    for (let i = 0; i < crs.length; i++) {
      const cr = crs[i];
      cr.priority = (Number(cr.priority) - 1); // Decrease priority by one


      await this.CrRepository.save(cr);
    }
  }

  async findByStatus(status: string): Promise<CR[]> {
    return this.CrRepository.find({ where: { status } });
  }


  async create(cr: CR): Promise<CR> {

    const title = cr.topic;
    const name = cr.name;
    const hodEmail = 'trainingitasst.cbl@cbllk.com';    // HOD's Email

    await this.emailService.sendEmail(
      hodEmail,
      'Approval Required for New Change Request',
      `
      <p><h2>Review and Approval Needed for Change Request Submission</h2></p>
      You have received a new change request that requires your attention and approval.
      <p><strong>Change Request Details:</strong></p>
      <ul>

        <li><strong>Title:</strong> ${title}</li>
        <li><strong>Submitted by:</strong> ${name}</li>
      </ul>
      <p>Please review the attached documentation and provide your approval at your earliest convenience.
      You can approve this by logging into the CR management system.</p>
      <p>Thank you!</p>

    `,
    true
    );

    const createdCR = await this.CrRepository.save(cr);
    return createdCR;
  }

  async uploadFile(cr: CR, randomName: string): Promise<CR> {
    const filePath = '/uploads/cr/' + randomName; 
    cr.filePath = filePath; 

    const createdCR = await this.CrRepository.save(cr);
    return createdCR;
  }

  async update(crId: number, cr: CR): Promise<CR> {
    await this.CrRepository.update(crId, cr);
    return await this.CrRepository.findOne({ where: { crId } });
  }

  async delete(crId: number): Promise<void> {
    await this.CrRepository.delete(crId);
  }

  async findOne(crId: number): Promise<CR> {
    return await this.CrRepository.findOne({ where: { crId } });
  }

  async updatePriority(crId: number, priority: number) {
    const cr = await this.CrRepository.findOne({ where: { crId } });
    if (!cr) {
      throw new Error(`CR with ID ${crId} not found`);
    }

    const oldPriority = Number(cr.priority);

    // Only proceed with update if the new priority is different from the old one
    if (priority !== oldPriority) {
      // Get all CRs sorted by their current priority
      const allCRs = await this.CrRepository.find({
        order: {
          priority: 'ASC',
        },
      });

      // Update the current CR's priority
      cr.priority = priority;

      // Shift priorities of other CRs accordingly
      for (const otherCR of allCRs) {
        if (otherCR.crId !== crId) {
          let otherPriority = Number(otherCR.priority);
          if (priority < oldPriority) {
            if (otherPriority >= priority && otherPriority < oldPriority) {
              otherCR.priority = (otherPriority + 1);
            }
          } else {
            if (otherPriority <= priority && otherPriority > oldPriority) {
              otherCR.priority = (otherPriority - 1);
            }
          }
          if (isNaN(priority)) {
            priority = null;
          }
          
          await this.CrRepository.save(otherCR);
        }
        
      }
      if (isNaN(priority)) {
        priority = null;
      }


      await this.CrRepository.save(cr);
    }
    if (isNaN(priority)) {
      priority = null;
    }


    const updatedCRs = await this.CrRepository.find({
      relations: ['userId'], 
      order: {
        priority: 'ASC'
      }
    });

    // Extract unique email addresses from the fetched CRs
    const uniqueEmails = new Set(updatedCRs.map(cr => cr.userId?.username));

    // Iterate over unique email addresses
    for (const email of uniqueEmails) {
      // Filter CRs specific to the current user
      const userSpecificCRs = updatedCRs.filter(cr => cr.userId?.username === email);

      // Construct email content for the current user
      let emailContent = `
      <html>
      <head>
          <title>Change Request Priority Update Notification</title>
          <style>
          body {
              font-family: Arial, sans-serif;
              margin: 20px;
          }
          table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
          }
          th, td {
              padding: 12px;
              border: 1px solid #ddd;
              text-align: left;
          }
          th {
              background-color: #4CAF50;
              color: white;
          }
          tr:nth-child(even) {
              background-color: #f2f2f2;
          }
          </style>
      </head>
      <body>
          <h2>Change Request Priority Update Notification</h2>
          <p>Your change requests with the following details have had their priorities updated:</p>
          <table>
              <tr>
                  <th>CR ID</th>
                  <th>Topic</th>
                  <th>Priority</th>
              </tr>`;

      userSpecificCRs.forEach(cr => {

        if (Number(cr.priority) > 0) {
          emailContent += `
                        <tr>
                            <td>${cr.crId}</td>
                            <td>${cr.topic}</td>
                            <td>${cr.priority}</td>
                        </tr>`;
        }
      });

      emailContent += `
          </table>
      </body>
      </html>`;

      await this.emailService.sendEmail(
        email,
        'Change Request Priority Updated',
        emailContent,
      );
    }

  return cr;
  }




  async updateCRStatus(crId: number, status: string): Promise<CR> {
    const cr = await this.CrRepository.findOne({ where: { crId } });
    if (!cr) {
      throw new Error('CR not found');
    }
    cr.status = status; 
    return await this.CrRepository.save(cr);
  }

  async updateHODApproval(crId: number, hodApproval: string): Promise<CR> {
    try {
      const cr = await this.CrRepository.findOneOrFail({
        where: { crId },
        relations: ['userId'],
      });
      
      cr.hodApprovel = hodApproval;
      cr.hodApprovelAt = new Date();

      if (hodApproval === 'approved') {
        const maxPriorityCR = await this.CrRepository.createQueryBuilder('cr')
          .select('MAX(cr.priority)', 'maxPriority')
          .getRawOne();

        let maxPriority = 0;
        if (maxPriorityCR && maxPriorityCR.maxPriority) {
          maxPriority = parseInt(maxPriorityCR.maxPriority);
        }

        // Assign the new priority
        const newPriority = maxPriority + 1;
        if (isNaN(newPriority)) {
          cr.priority = null;
        } else {
          cr.priority = newPriority;
        }
        cr.status = 'Pending to get development';
        
      }

      const userEmail = await this.getUserUsernameForCR(crId); // Fetch user's email
      await this.emailService.sendEmail(
        userEmail,
        `Your Change Request has been ${hodApproval}!`,
        `<p><h2>Change Request Status Update</h2></p>
      
        We are pleased to inform you that your Change Request (CR) has been ${hodApproval} by the Head of Department (HOD).
      
        <p><strong>Change Request Details:</strong></p>
        <ul>
          <li><strong>CR ID:</strong> ${crId}</li>
          <li><strong>Title:</strong> ${cr.topic}</li>
          ${hodApproval === 'approved' ? `<li><strong>CR Priority:</strong> ${cr.priority}</li>` : ''}
          <li><strong>Status:</strong> ${hodApproval}</li>
        </ul>
        ${hodApproval === 'approved' ?`<p>Your requested changes are now approved and will be implemented accordingly.</p>` : ''}
      
        If you have any further questions or need assistance, feel free to contact us.
      
        <p>Thank You!</p>`,
        true
      );
      
    if (hodApproval === 'rejected') {
        cr.status = 'CR Rejected';
      }

      return await this.CrRepository.save(cr);
    } catch (error) {
      console.error('Error updating HOD approval:', error);
      throw error;
    }
  }

  async getUserUsernameForCR(crId: number): Promise<string> {
    const cr = await this.CrRepository.findOneOrFail({
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