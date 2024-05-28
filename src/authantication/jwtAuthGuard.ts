/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
      throw new UnauthorizedException('Access token not provided');
    }

    const accessToken = authorizationHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(accessToken);
      request.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
