/* eslint-disable prettier/prettier */
// src/user/user.controller.ts
import { Controller, Post, Body, Get, Put, Req, UnauthorizedException, NotFoundException, Param, UseGuards, ForbiddenException  } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../authantication/jwtAuthGuard';
import { RoleGuard } from 'src/guard/role.guard';
import { Constants } from 'src/utils/constants';


@Controller('users')
@UseGuards(JwtService)
export class UserController {
  constructor(private readonly userService: UserService) {}

@Post('register')
async register(@Body() user: User): Promise<User> {
  return await this.userService.create(user);
  }

@Post('login')async login(@Body() credentials: { username: string; password: string }): Promise<{ user: User; accessToken: string; userId: number; userType: string; firstname:string; lastname:string;}> {
  try {
    const { user, accessToken, userId, userType,firstname,lastname } = await this.userService.login(credentials.username, credentials.password);
    return { user, accessToken, userId, userType,firstname,lastname};
  } catch (error) {
    if (error instanceof NotFoundException || error instanceof ForbiddenException) {
      throw error;
    } else {
      throw new UnauthorizedException(error.message);
    }
  }
}

  @UseGuards(new RoleGuard(Constants.ROLES.Admin))
  @Get()
  @UseGuards(JwtAuthGuard) // Applying JwtAuthGuard
  async getAllUsers(@Req() req: Request): Promise<User[]> {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
    const accessToken = authorizationHeader.split(' ')[1]; 
    return await this.userService.findAll(accessToken);
  }


  @Post('approve/:userId')
  async approveUser(@Param('userId') userId: number): Promise<string> {
    await this.userService.approveUser(userId);
    return 'User approved';
  }

  @Post('reject/:userId')
  async rejectUser(@Param('userId') userId: number): Promise<string> {
    await this.userService.rejectUser(userId);
    return 'User rejected';
  }


  @Put(':userId')
  async update(@Param('userId') userId: string, @Body() updatedUser: User): Promise<User> {
    return await this.userService.updateUser(parseInt(userId, 10), updatedUser);
  }
}
