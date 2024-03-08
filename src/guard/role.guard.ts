/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';

export class RoleGuard implements CanActivate {
  private userType: string;

  constructor(userType: string) {
    this.userType = userType;
  }

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const request: any = ctx.getRequest<Request>();
    if (this.userType == request.user.userType) return true;

    return false;
  }
}
