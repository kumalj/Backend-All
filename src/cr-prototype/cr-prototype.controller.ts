import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateCrPrototypeDto } from './dto/create-cr-prototype.dto';
import { UpdateCrPrototypeDto } from './dto/update-cr-prototype.dto';
import { CRPrototypeService } from './cr-prototype.service'
import { CRPrototype } from './cr-prototype.entity';

// @Controller('cr-prototype')
// export class CrPrototypeController {
//   constructor(private readonly crPrototypeService: CRPrototypeService) {}


  // @Post()
  // async createCRPrototype(
  //   @Body('file') file: string,
  //   @Body('description') description: string,
  //   @Body('crId') crId: number,
  // ): Promise<CRPrototype> {
  //   return await this.crPrototypeService.createCRPrototype(file, description, crId);
  // }
  

  
  
  

//   // @Post()
//   // create(@Body() createCrPrototypeDto: CreateCrPrototypeDto) {
//   //   return this.crPrototypeService.create(createCrPrototypeDto);
//   // }

//   // @Get()
//   // findAll() {
//   //   return this.crPrototypeService.findAll();
//   // }

//   // @Get(':id')
//   // findOne(@Param('id') id: string) {
//   //   return this.crPrototypeService.findOne(+id);
//   // }

//   // @Patch(':id')
//   // update(@Param('id') id: string, @Body() updateCrPrototypeDto: UpdateCrPrototypeDto) {
//   //   return this.crPrototypeService.update(+id, updateCrPrototypeDto);
//   // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.crPrototypeService.remove(+id);
  // }
}
