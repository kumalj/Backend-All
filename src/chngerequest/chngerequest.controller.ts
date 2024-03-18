/* eslint-disable prettier/prettier */
// src/cat.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, UploadedFile, UseInterceptors, BadRequestException, NotFoundException, Res} from '@nestjs/common';
import { CR } from './chngerequest.entity';
import { CrService } from './chngerequest.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../authantication/jwtAuthGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import path, { extname } from 'path';


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
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@UploadedFile() file) {
    try {
      const image = file.filename;
      const cr = await this.crService.getCrById
      //await this.crService.updateImageInCR({cr},image); // Assuming you have the logic to update the image in the CR service
      return { message: 'Success' };
    } catch (error) {
      return { message: 'Error', error: error.message };
    }
  }

  // @Put('update-priorities')
  // async updatePriorities(@Body() crs: CR[]): Promise<void> {
  //   await this.crService.updatePriorities(crs);
  // }

  @Put(':crId/priority')
  async updatePriority(@Param('crId') crId: number, @Body('priority') priority: number) {
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
