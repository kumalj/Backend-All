/* eslint-disable prettier/prettier */
// src/cat.service.ts

import { Injectable ,NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CR } from './chngerequest.entity';
import { Getcr } from '../getcr/getcr.entity';
import { User } from 'src/user/user.entity';
import {MoreThanOrEqual , Not} from "typeorm";


@Injectable()
export class CrService {
  constructor(
    @InjectRepository(CR)
    private readonly CrRepository: Repository<CR>,
    @InjectRepository(Getcr)
    private readonly GetCrRepository: Repository<Getcr>,
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>


  ) { }

  async findAll(): Promise<CR[]> {
    return await this.CrRepository.find({ relations: ['userId','getCr', 'getCr.user', 'getCr.cr'] });
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
      cr.status = 'Starting Development';

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

      return cr;
    } catch (error) {
      console.error("Error in startDevelopment:", error);
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

 async create(cr: CR ): Promise<CR> {
  // Find the maximum priority in the database
  const maxPriorityCR = await this.CrRepository
    .createQueryBuilder("cr")
    .select("MAX(cr.priority)", "maxPriority")
    .getRawOne();

  let maxPriority = 0;
  if (maxPriorityCR && maxPriorityCR.maxPriority) {
    maxPriority = parseInt(maxPriorityCR.maxPriority);
  }
  cr.priority = (maxPriority + 1).toString();

  const createdCR = await this.CrRepository.save(cr);
  return createdCR;
}


// cr.service.ts

async uploadFile(cr: CR, randomName: string): Promise<CR> {
  const filePath = '/uploads/cr/' + randomName; // Use the provided randomName in the file path
  cr.filePath = filePath; // Assign the file path to the CR object

  // Save the CR
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
                priority: 'ASC'
            }
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

    return cr;
}

async updateCRStatus(crId: number, status: string): Promise<CR> {
  const cr = await this.CrRepository.findOne({where:{crId}});
  if (!cr) {
    throw new Error('CR not found');
  }
  cr.status = status; // Assuming you have a status field in CR entity
  return await this.CrRepository.save(cr);
}



async updateHODApproval(crId: number, hodApproval: string): Promise<CR> {
  const cr = await this.CrRepository.findOneOrFail({where:{crId}});
  cr.hodApprovel = hodApproval;
  return this.CrRepository.save(cr);
}


}