// crprototype.controller.ts

import { Controller, Post, Body,Param,Get, } from '@nestjs/common';
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
}
