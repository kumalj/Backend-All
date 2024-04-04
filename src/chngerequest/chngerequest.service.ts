/* eslint-disable prettier/prettier */
// src/cat.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CR } from './chngerequest.entity';
import { Getcr } from '../getcr/getcr.entity';
import { User } from 'src/user/user.entity';
import { MoreThanOrEqual, Not } from 'typeorm';
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

  // ,'getCr.cr'

  async startDevelopment(crId: number, userId: number): Promise<CR> {
    try {
      // Find the CR by ID
      const cr = await this.CrRepository.findOne({ where: { crId } });
      if (!cr) {
        throw new Error(`CR with ID ${crId} not found`);
      }

      // Update CR status
      cr.status = 'Taken For Development';

      // Save the updated CR
      await this.CrRepository.save(cr);

      // Retrieve the user by ID
      const user = await this.UserRepository.findOne({ where: { userId } });
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      // Log the crId and userId in Getcr table
      const getcr = new Getcr();
      getcr.cr = cr;
      getcr.user = user;

      // Ensure getcr is correctly passed and of the correct type
      await this.GetCrRepository.save(getcr);

      // Update priorities
      await this.updatePriorities();

      const userEmail = await this.getUserUsernameForCR(crId); // Fetch user's email
      await this.emailService.sendEmail(
        userEmail,
        `Your Change Request has been get to Development!`,
        `Dear ${cr.name} ,
          The Change Request You get now has been get to Development by the Developer.
          Please LogIn to the Change Request Management System to see further details.

         Best regards,
         IT Team`,
      );

      return cr;

    } catch (error) {
      console.error('Error in startDevelopment:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }

  async updatePriorities(): Promise<void> {
    // Get all CRs ordered by priority
    const crs = await this.CrRepository.find({ order: { priority: 'ASC' } });

    // Update priorities based on their order, starting from the first CR
    for (let i = 0; i < crs.length; i++) {
      const cr = crs[i];
      cr.priority = (parseInt(cr.priority) - 1).toString(); // Decrease priority by one
      await this.CrRepository.save(cr);
    }
  }

  async findByStatus(status: string): Promise<CR[]> {
    return this.CrRepository.find({ where: { status } });
  }

  // Inside CrService

  async create(cr: CR): Promise<CR> {
    // Find the maximum priority in the database
    // const maxPriorityCR = await this.CrRepository
    //   .createQueryBuilder("cr")
    //   .select("MAX(cr.priority)", "maxPriority")
    //   .getRawOne();

    // let maxPriority = 0;
    // if (maxPriorityCR && maxPriorityCR.maxPriority) {
    //   maxPriority = parseInt(maxPriorityCR.maxPriority);
    // }
    // cr.userId = userId;
    // Assign the new priority
    // cr.priority = (maxPriority + 1).toString();

    //const title = cr.topic;
    //const name = cr.name;

    // await this.emailService.sendEmail(
    //   'trainingitasst.cbl@cbllk.com',
    //   'Need CR Approval',
    //   `
    //   <h1>Change Request Approval Needed</h1>
    //   <p>Dear HOD,</p>
    //   <p>You have received a new change request that requires your attention and approval.</p>
    //   <p><strong>Change Request Details:</strong></p>
    //   <ul>

    //     <li><strong>Title:</strong> ${title}</li>
    //     <li><strong>Submitted by:</strong> ${name}</li>
    //   </ul>
    //   <p>Please review the attached documentation and provide your feedback or approval at your earliest convenience.</p>
    //   <p>You can approve this by logging into the CR management system.</p>
    //   <p>Thank you for your prompt attention to this matter.</p>
    //   <p>Best Regards,<br>IT Team</p>
    // `,
    // );

    const createdCR = await this.CrRepository.save(cr);
    return createdCR;
  }

  // cr.service.ts

  async uploadFile(cr: CR, randomName: string): Promise<CR> {
    const filePath = '/uploads/cr/' + randomName; // Use the provided randomName in the file path
    cr.filePath = filePath; // Assign the file path to the CR object

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
      cr.priority = String(priority);

      // Shift priorities of other CRs accordingly
      for (const otherCR of allCRs) {
        if (otherCR.crId !== crId) {
          let otherPriority = Number(otherCR.priority);
          if (priority < oldPriority) {
            if (otherPriority >= priority && otherPriority < oldPriority) {
              otherCR.priority = String(otherPriority + 1);
            }
          } else {
            if (otherPriority <= priority && otherPriority > oldPriority) {
              otherCR.priority = String(otherPriority - 1);
            }
          }
          await this.CrRepository.save(otherCR);
        }
      }

      // Save the updated priority for the current CR
      await this.CrRepository.save(cr);
    }


    const updatedCRs = await this.CrRepository.find({
      relations: ['userId'], // Ensure the correct relation name is used
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
        // Convert priority from string to number and check if it's greater than 0
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

      // Send email to the current user
      await this.emailService.sendEmail(
        email,
        'Change Request Priority Updated',
        emailContent,
      );
    }

    // Return the result if needed
    return cr;
  }




  async updateCRStatus(crId: number, status: string): Promise<CR> {
    const cr = await this.CrRepository.findOne({ where: { crId } });
    if (!cr) {
      throw new Error('CR not found');
    }
    cr.status = status; // Assuming you have a status field in CR entity
    return await this.CrRepository.save(cr);
  }

  async updateHODApproval(crId: number, hodApproval: string): Promise<CR> {
    try {
      const cr = await this.CrRepository.findOneOrFail({
        where: { crId },
        relations: ['userId'],
      });

      // Update hodApproval
      cr.hodApprovel = hodApproval;

      if (hodApproval === 'approved') {
        // Find the maximum priority in the database
        const maxPriorityCR = await this.CrRepository.createQueryBuilder('cr')
          .select('MAX(cr.priority)', 'maxPriority')
          .getRawOne();

        let maxPriority = 0;
        if (maxPriorityCR && maxPriorityCR.maxPriority) {
          maxPriority = parseInt(maxPriorityCR.maxPriority);
        }

        // Assign the new priority
        const newPriority = maxPriority + 1;
        cr.priority = newPriority.toString();
        cr.status = 'Pending to get development';
      }

      //       const userEmail = await this.getUserUsernameForCR(crId); // Fetch user's email
      //       await this.emailService.sendEmail(
      //         userEmail,
      //         `Your CR Request has been ${hodApproval}!`,
      //         `Dear ${cr.userId.firstname} ${cr.userId.lastname},

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
      //       );

      if (hodApproval === 'rejected') {
        cr.status = 'CR Rejected';
      }

      // Save the updated CR
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
