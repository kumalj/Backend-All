// jwt.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwtAuthGuard';

@Module({
  imports: [
    JwtModule.register({
      secret: 'pass@123', 
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  providers: [
    JwtAuthGuard,
    JwtService, 
  ],
  exports: [
    JwtAuthGuard,
    JwtService, 
  ],
})
export class JwtCustomModule {}
