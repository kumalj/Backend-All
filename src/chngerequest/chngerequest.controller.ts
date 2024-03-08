// src/cat.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards,Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import { CR } from './chngerequest.entity';
import { CrService } from './chngerequest.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../authantication/jwtAuthGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Multer } from 'multer';

@Controller('crs')
@UseGuards(JwtService)
export class CrController {
  constructor(private readonly crService: CrService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<CR[]> {
    return this.crService.findAll();
  }

  @Post()
  async create(@Body() cr: CR): Promise<CR> {
    const createdCR = await this.crService.create(cr);
    return createdCR;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Handle file processing or database storage here
    console.log(file);
    return { message: 'File uploaded successfully', filename: file.filename };
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
  async startDevelopment(@Param('id') id: number) {
    return this.crService.startDevelopment(id);
  }
  
  @Get('start-development')
  async getCRsInStartDevelopment(): Promise<CR[]> {
    return this.crService.findByStatus('Starting Development');
  }
  
}
