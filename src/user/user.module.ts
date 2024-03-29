/* eslint-disable prettier/prettier */
// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; 
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from 'src/mail/mail.module';

// Other imports and declarations...

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'pass@123',
      signOptions: { expiresIn: '1h' },
    }),MailModule
    // Other modules...
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], 
})
export class UserModule {}
