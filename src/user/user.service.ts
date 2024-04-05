/* eslint-disable prettier/prettier */
// src/user/user.service.ts
import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';//make sure install this  package by npm i --save bcrypt
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  private readonly users: User[] = [];
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private emailService: MailService
  ) { }

  //Register part of the system
  async create(user: User): Promise<User> {
    // Check if the username is already taken
    const existingUser = await this.findByUsername(user.username);
    if (existingUser) {
        throw new BadRequestException('Username is already taken');
    }

    // Hash the user's password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;

    // Send a welcome email to the user
    const userEmail = user.username;
    await this.emailService.sendEmail(
      userEmail,
      'Welcome to Change Request Management System',
      'You have successfully registered for the Change Request Management System! Your account is pending approval from the Admin. Please wait for the admin to approve your account to log in. Thank you!',
      true,
    );

    const name = user.firstname + " " + user.lastname;
    await this.emailService.sendEmail(
      'trainingitasst.cbl@cbllk.com',
      'Account Registration',
      'A new user with the name ' + name + ' has registered for the Change Request Management System: ',
      true,

    );


    return await this.userRepository.save(user);
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
  async login(username: string, password: string): Promise<{ user: User; accessToken: string; userId: number; userType: string; firstname:string; lastname:string; extension:number; }> {
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
    const payload = { username: user.username, sub: user.userId, userType: user.userType, firstname:user.firstname, department: user.department, lastname:user.lastname, extension:user.extension };
    const accessToken = this.jwtService.sign(payload);
    return { user, accessToken, userId: user.userId, userType: user.userType,firstname:user.firstname,  lastname:user.lastname, extension:user.extension };
}



//Account approve part of the 
  async approveUser(userId: number,): Promise<void> {
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

    const userEmail = user.username;

    // Send a welcome email to the user with the updated status
    await this.emailService.sendEmail(
        userEmail,
        'Your account status in Change Request Management System',
        `The account you created in Change Request Management System has been ${status} by the administrator!`,
        true
    );

    return await this.userRepository.save(user);
}

}
