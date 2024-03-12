/* eslint-disable prettier/prettier */
// change-request.service.ts

import { Injectable } from '@nestjs/common';
import { ChangeRequest } from './change-request.interface';

@Injectable()
export class ChangeRequestService {
  private changeRequests: ChangeRequest[] = [];
  

  async getAllChangeRequestsSortedByPriority(): Promise<ChangeRequest[]> {
    // Sort change requests by priority
    return this.changeRequests.sort((a, b) => a.priority - b.priority);
  }

  async updatePriorityOrder(
    id: string,
    updatedChangeRequest: ChangeRequest
  ): Promise<void> {
    const index = this.changeRequests.findIndex((cr) => cr.id === id);
    if (index !== -1) {
      this.changeRequests[index] = updatedChangeRequest;
    }
  }
}
