/* eslint-disable prettier/prettier */
// change-request.controller.ts

import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ChangeRequest } from './change-request.interface';
import { ChangeRequestService } from './change-request.service';

@Controller('change-requests')
export class ChangeRequestController {
  constructor(private readonly crService: ChangeRequestService) {}

  @Get()
  async getAllChangeRequestsSortedByPriority(): Promise<ChangeRequest[]> {
    return await this.crService.getAllChangeRequestsSortedByPriority();
  }

  @Put(':id/update-priority') // Define the route with parameter :id
  async updatePriorityOrder(
    @Param('id') id: string,
    @Body() updatedChangeRequest: ChangeRequest
  ): Promise<ChangeRequest[]> {
    await this.crService.updatePriorityOrder(id, updatedChangeRequest);
    return await this.crService.getAllChangeRequestsSortedByPriority(); // Refresh and return the updated list
  }
}
