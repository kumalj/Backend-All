/* eslint-disable prettier/prettier */
import { Controller, Post, Body,Param,Get, UploadedFile, UseInterceptors,Put } from '@nestjs/common';
import { CRPrototype } from './crprototype.entity';
import { CrPrototypeService } from './crprototype.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Getcr } from 'src/getcr/getcr.entity';

@Controller('crprototype')
export class CrPrototypeController {
  constructor(private readonly crPrototypeService: CrPrototypeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/prototype/', // Destination directory to store files
      filename: (req, file, cb) => {
        // Generate a unique filename
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`); 
      },
    }),
  }))
  async create(@Body() crPrototypeData: CRPrototype, @UploadedFile() file: Express.Multer.File): Promise<CRPrototype> {
    let filePath = '';
    if (file) {

      filePath = file.filename;
      crPrototypeData.filePath = filePath; 
    }
    return this.crPrototypeService.create(crPrototypeData);
  }
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const filePath = '/uploads/prototype/' + file.originalname;
    return filePath;
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
  async approve(@Param('prId') prId: number, @Body() getCrData: Getcr): Promise<CRPrototype> {
    return this.crPrototypeService.approve(prId, getCrData);
  }
  
  @Put(':prId/secondpr')
  secondpr(@Param('prId') prId: number): Promise<CRPrototype> {
    return this.crPrototypeService.secondpr(prId);
  }

  @Put(':prId/reject')
  reject(@Param('prId') prId: number, @Body('reason') reason: string, @Body() getCrData: Getcr): Promise<CRPrototype> {
    return this.crPrototypeService.reject(prId, reason,getCrData);
  }

  @Put(':prId')
  async updateCRPrototype(
    @Param('prId') prId: number,
    @Body() updateData: Partial<CRPrototype>,
  ): Promise<void> {
    await this.crPrototypeService.updateCRPrototype(prId, updateData);
  }

  @Put(':prId/uatapprovel')
  async uatapprovel(@Param('prId') prId: number): Promise<void> {
    await this.crPrototypeService.uatapprovel(prId);
  }

  @Put(':prId/afteruatapprovel')
  async afteruatapprovel(@Param('prId') prId: number): Promise<void> {
    await this.crPrototypeService.afteruatapprovel(prId);
  }
  
  @Put('updatePopupStatus/:crId')
  async updatePopupStatus(@Param('crId') crId: number, @Body('popupstatus') popupstatus: string): Promise<void> {
    await this.crPrototypeService.updatePopupStatus(crId, popupstatus);
  }
}
