// crp.controller.ts

import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { CrpService } from './cr-p.service';
import { Crp } from './cr-p.entity';
import { JwtService } from '@nestjs/jwt';


@Controller('crp')
@UseGuards(JwtService)
export class CrpController {
  constructor(private readonly crpService: CrpService) {}

  @Post()
  async create(@Body() crp: Crp): Promise<Crp> {
    return this.crpService.create(crp);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatedCrp: Crp): Promise<Crp | undefined> {
    return this.crpService.update(+id, updatedCrp);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.crpService.delete(+id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Crp | undefined> {
    return this.crpService.findOne(+id);
  }

  @Get()
  async findAll(): Promise<Crp[]> {
    return this.crpService.findAll();
  }
}
