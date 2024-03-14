/* eslint-disable prettier/prettier */
// src/cat.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, UploadedFile, UseInterceptors} from '@nestjs/common';
import { CR } from './chngerequest.entity';
import { CrService } from './chngerequest.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../authantication/jwtAuthGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@Controller('crs')
@UseGuards(JwtService)
export class CrController {
  constructor(private readonly crService: CrService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<CR[]> {
    return this.crService.findAll();
  }

  // file-upload.controller.ts


  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/',
      filename: (req, file, cb) => {
        const fileName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${fileName}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadFile(
    @Body('crId') crId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {

      const fileName = file.filename;
      const status = await this.crService.uploadFile(crId, fileName);
      return { Status: status };
    } catch (error) {
      return { Message: 'Error', Error: error.message };
    }
  }
  


  @Post()
  async create(@Body() cr: CR): Promise<CR> {
    const createdCR = await this.crService.create(cr);
    return createdCR;
  }
  

  @Put(':crId/priority')
  async updateCrPriority(@Param('crId') crId: number, @Body('priority') priority: string) {
    return await this.crService.updatePriority(crId, priority);
  }

  @Delete(':crId')
  delete(@Param('crId') crId: string): Promise<void> {
    return this.crService.delete(+crId);
  }

 
  @Put(':id/start-development')
async startDevelopment(@Param('id') crId: number, @Body('userId') userId: number): Promise<CR> {
    return this.crService.startDevelopment(crId, userId); 
}

  
  @Get('start-development')
  async getCRsInStartDevelopment(): Promise<CR[]> {
    return this.crService.findByStatus('Starting Development');
  }
  
}
