/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
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
    const name1 = user.firstname
    await this.emailService.sendEmail(
      userEmail,
      'Welcome to the Change Request Management System',
      '<p><h2>Welcome to the Change Request Management System - Account Pending Approval</h2></p><p>We are pleased to confirm that you have successfully registered for the Change Request Management System. Your account is currently pending approval from our administrator.<br>Please allow some time for this process to be completed. We will notify you via email once your account has been activated and you can log in to start using the system.<br>Thank you!</p><p>Best regards,<br>IT Team.</p>',
      true,
    );

    const name = user.firstname + " " + user.lastname;
    const time = user.createdAt;
    const adminEmail = 'trainingitasst.cbl@cbllk.com'   // admin's email
    await this.emailService.sendEmail(
      adminEmail,       
      'New Account Registration - Action Required',

      `<p>Dear Admin,</p>
       <p>A new account has been registered by ${name} on ${time}.<br>
       Please review and make a decision regarding the approval of this account.<br>
       Thank you!</p>
       <p>Best regards,<br>
        IT Team.</p>`,
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

//Login part of the database
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



//Account approve or reject part 
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


  //status update part

  async updateUser(userId: number, updatedUser: User): Promise<User> {
    const user = await this.findUserById(userId);
    if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const { userType, status } = updatedUser;
    const name = user.firstname
    user.userType = userType;
    user.status = status;

    const userEmail = user.username;

    // Send a welcome email to the user with the updated status
    await this.emailService.sendEmail(
        userEmail,
        'Account Status Update - Change Request Management System',
        `<p><h2>Account Status Update</h2></p><p>We are writing to inform you that the account you created in the Change Request Management System has been ${status} by the administrator.<br>Thank you for your attention.</p><p>Best regards,<br>IT Team.</p>`,
        true
    );

    return await this.userRepository.save(user);
}

}
