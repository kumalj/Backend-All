// crprototype.controller.ts

import { Controller, Post, Body,Param,Get, UploadedFile, UseInterceptors,Put } from '@nestjs/common';
import { CRPrototype } from './crprototype.entity';
import { CrPrototypeService } from './crprototype.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('crprototype')
export class CrPrototypeController {
  constructor(private readonly crPrototypeService: CrPrototypeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/', // Destination directory to store files
      filename: (req, file, cb) => {
        // Generate a unique filename
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`); // Concatenate the random name with the original extension
      },
    }),
  }))
  async create(@Body() crPrototypeData: CRPrototype, @UploadedFile() file: Express.Multer.File): Promise<CRPrototype> {
    let filePath = '';
    if (file) {
      // If file is uploaded, get the file path
      filePath = file.filename; // Just use the filename, as it's already saved in the ./uploads/ directory
      crPrototypeData.filePath = filePath; // Assign the file path to the CR object
    }
    return this.crPrototypeService.create(crPrototypeData);
  }


  @Get()
  async findAll(): Promise<CRPrototype[]> {
    return this.crPrototypeService.findAll();
  }

  @Get(':prId')
  async findOne(@Param('prId') prId: number): Promise<CRPrototype> {
    return this.crPrototypeService.findOne(prId);
  }

  @Put(':prId/approve')
  approve(@Param('prId') prId: number): Promise<CRPrototype> {
    return this.crPrototypeService.approve(prId);
  }

  @Put(':prId/reject')
  reject(@Param('prId') prId: number, @Body('reason') reason: string): Promise<CRPrototype> {
    return this.crPrototypeService.reject(prId, reason);
  }

  @Put(':prId')
  async updateCRPrototype(
    @Param('prId') prId: number,
    @Body() updateData: Partial<CRPrototype>, // Assuming you only need to update status
  ): Promise<void> {
    await this.crPrototypeService.updateCRPrototype(prId, updateData);
  }
}
