

import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/api/data')
  getData() {
    return { message: 'Data from backend' };
  }
}
