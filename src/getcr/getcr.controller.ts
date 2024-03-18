/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateGetCrDto } from './dto/create-getcr.dto';
import { UpdateGetCrDto } from './dto/update-getcr.dto';
import { GetCrService } from './getcr.service'
import { Getcr } from './getcr.entity';

@Controller('cr-prototype')
export class GetCrController {
  constructor(private readonly crPrototypeService: GetCrService) {}
  

  @Post()
  create(@Body() createCrPrototypeDto: CreateGetCrDto) {
    return this.crPrototypeService.create(createCrPrototypeDto);
  }

  @Get()
  findAll() {
    return this.crPrototypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.crPrototypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCrPrototypeDto: UpdateGetCrDto) {
    return this.crPrototypeService.update(+id, updateCrPrototypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.crPrototypeService.remove(+id);
  }
}
