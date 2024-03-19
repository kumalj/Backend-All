// crprototype.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { CRPrototype } from './crprototype.entity';
import { CrPrototypeService } from './crprototype.service';

@Controller('crprototype')
export class CrPrototypeController {
  constructor(private readonly crPrototypeService: CrPrototypeService) {}

  @Post()
  async create(@Body() crPrototypeData: CRPrototype): Promise<CRPrototype> {
    return this.crPrototypeService.create(crPrototypeData);
  }
}
