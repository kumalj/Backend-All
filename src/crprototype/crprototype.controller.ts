// crprototype.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CRPrototypeService } from './crprototype.service';
import { CRPrototype } from './crprototype.entity';

@Controller('crprototype')
export class CRPrototypeController {
  constructor(private readonly crPrototypeService: CRPrototypeService) {}

  @Post()
  async createCRPrototype(@Body() crPrototypeData: Partial<CRPrototype>): Promise<CRPrototype> {
    return this.crPrototypeService.createCRPrototype(crPrototypeData);
  }
}
