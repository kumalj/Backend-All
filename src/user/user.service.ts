/* eslint-disable prettier/prettier */
// src/user/user.service.ts
import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';//make sure install this  package by npm i --save bcrypt
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private readonly users: User[] = [];
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  //Register part of the system
  async create(user: User): Promise<User> {
    const existingUser = await this.findByUsername(user.username);
    if (existingUser) {
        throw new BadRequestException('Username is already taken');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;



    return await this.userRepository.save(user);
}

async generateUniqueKey(): Promise<string> {
    const min = 1000;
    const max = 9999;
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}




  async findAll(accessToken: string): Promise<User[]> {
    return await this.userRepository.find();
  }
  async findUserById(userId: number): Promise<User> {
    return this.userRepository.findOne({ where: { userId } });
  }
  async findByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { username } });
  }

  // async findByUsername(username: string): Promise<User> {
  //   return await this.userRepository.findOne({ username });
  // }

//Login part of the  database
  async login(username: string, password: string): Promise<{ user: User; accessToken: string; userId: number; userType: string; firstname:string }> {
    const user = await this.findByUsername(username);
    if (!user) {
        throw new NotFoundException('User not found');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new UnauthorizedException('Invalid username or password');
    }
    if (user.status === 'rejected') {
        throw new ForbiddenException('Your account has been rejected. Please contact support.');
    }
    if (user.status !== 'approved') {
        throw new ForbiddenException('Your account is pending approval.');
    }
    const payload = { username: user.username, sub: user.userId, userType: user.userType, firstname:user.firstname };
    const accessToken = this.jwtService.sign(payload);
    return { user, accessToken, userId: user.userId, userType: user.userType, firstname:user.firstname };
}



//Account approve part of the 
  async approveUser(userId: number): Promise<void> {
    const User = await this.findUserById(userId);
    if (!User) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    User.status = 'approved';
    await this.userRepository.save(User);
  }

  async rejectUser(userId: number): Promise<void> {
    const User = await this.findUserById(userId);
    if (!User) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    User.status = 'rejected';
    await this.userRepository.save(User);
  }


  //satatus update part

  async updateUser(userId: number, updatedUser: User): Promise<User> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const { userType, status } = updatedUser;
    user.userType = userType;
    user.status = status;

    return await this.userRepository.save(user);
  }
}
