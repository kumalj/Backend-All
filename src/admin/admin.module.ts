// admin.module.ts
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'pass@123', 
      signOptions: { expiresIn: '1h' }, 
    }),
    
  ],
  providers: [AdminService],
  exports: [AdminService], 
})
export class AdminModule {}
