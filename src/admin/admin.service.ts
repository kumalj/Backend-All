// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  // In a real-world scenario, you would use a database to store user credentials
  private readonly users = [
    { username: 'admin', password: 'adminpassword' }
  ];

  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<string | null> {
    const user = this.users.find(user => user.username === username && user.password === password);
    if (user) {
      const payload = { username: user.username };
      return this.jwtService.sign(payload);
    }
    return null;
  }
}