/* eslint-disable prettier/prettier */


import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, UploadedFile, UseInterceptors} from '@nestjs/common';
import { CR } from './chngerequest.entity';
import { CrService } from './chngerequest.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../authantication/jwtAuthGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RoleGuard } from 'src/guard/role.guard';
import { Constants } from 'src/utils/constants';


@Controller('crs')
@UseGuards(JwtService)
export class CrController {
  constructor(private readonly crService: CrService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<CR[]> {
    return this.crService.findAll();
  }

  @Post('create')
  
  @UseGuards(new RoleGuard(Constants.ROLES.SFA_User))
  @UseGuards(JwtAuthGuard) // Applying JwtAuthGuard
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/cr/', // Destination directory to store files
      filename: (req, file, cb) => {
        // Generate a unique filename
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`); // Concatenate the random name with the original extension
      },
    }),
  }))
  async create(@Body() cr: CR, @UploadedFile() file: Express.Multer.File): Promise<CR> {
    
    let filePath = '';
    if (file) {

      filePath = file.filename; 
      cr.filePath = filePath; 
    }

    const createdCR = await this.crService.create(cr);
    
    return createdCR;
  }
  
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const filePath = '/uploads/cr/' + file.originalname; 
    return filePath;
  }

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

  @Get(':crId')
  async findById(@Param('crId') crId: number): Promise<CR>{
    console.log(`Fetching CR with ID:${crId}`)
    return this.crService.findOne(crId)
  }  
  @Put('/:id/status')
  async updateCRStatus(@Param('id') id: number, @Body('status') status: string) {
    return await this.crService.updateCRStatus(id, status);
  }

  
  @Put(':id/update-hod-approval')
  async updateHODApproval(
    @Param('id') crId: number,
    @Body('hodApprovel') hodApproval: string,
  ) {
    return this.crService.updateHODApproval(crId, hodApproval);
  }


}