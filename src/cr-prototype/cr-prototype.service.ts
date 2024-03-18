// import { Injectable } from '@nestjs/common';
// import { CreateCrPrototypeDto } from './dto/create-cr-prototype.dto';
// import { UpdateCrPrototypeDto } from './dto/update-cr-prototype.dto';
// import { CRPrototype } from './cr-prototype.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CR } from '../chngerequest/chngerequest.entity'


//@Injectable()
//export class CRPrototypeService {
  // constructor(
  //   @InjectRepository(CRPrototype)
  //   private readonly crPrototypeRepository: Repository<CRPrototype>,
  //   @InjectRepository(CR)
  //   private readonly CrRepository: Repository<CR>,
  // ) {}

//   async createCRPrototype(file: string, description: string, crId: number): Promise<CRPrototype> {
//     const crPrototype = new CRPrototype();
//     crPrototype.file = file;
//     crPrototype.discription = description;
    
//     // Find the CR by its ID and assign it to the cr property
//     crPrototype.cr = await this.CrRepository.findOneOrFail({ where: { crId } });

//     return await this.crPrototypeRepository.save(crPrototype);
//   }
// }



//   // findAll() {
//   //   return `This action returns all crPrototype`;
//   // }

//   // findOne(id: number) {
//   //   return `This action returns a #${id} crPrototype`;
//   // }

//   // update(id: number, updateCrPrototypeDto: UpdateCrPrototypeDto) {
//   //   return `This action updates a #${id} crPrototype`;
//   // }

//   // remove(id: number) {
//   //   return `This action removes a #${id} crPrototype`;
//   // }
// // }
