// crprototype.controller.ts

import { Controller, Post, Body,Param,Get,Put } from '@nestjs/common';
import { CRPrototype } from './crprototype.entity';
import { CrPrototypeService } from './crprototype.service';

@Controller('crprototype')
export class CrPrototypeController {
  constructor(private readonly crPrototypeService: CrPrototypeService) {}

  @Post()
  async create(@Body() crPrototypeData: CRPrototype): Promise<CRPrototype> {
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
