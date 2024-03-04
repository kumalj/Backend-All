// auth.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('api')
export class AdminController {
  constructor(private readonly authService: AdminService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const token = await this.authService.validateUser(username, password);
    if (!token) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return { token };
  }
  
}