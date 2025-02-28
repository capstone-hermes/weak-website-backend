import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(email: string, password: string) {
    this.logger.log(`User logged in: ${email}:${password}`);

    // SQL Injection vulnerability
    const user = await this.userRepository.query(
      `SELECT * FROM user WHERE email = '${email}' AND password = '${password}'`
    );

    this.logger.log(`User found: ${JSON.stringify(user)}`);

    if (user.length === 0) {
      return { error: 'Invalid credentials' };
    }

    // Hardcoded weak JWT secret
    const token = jwt.sign({ userId: user[0].id }, 'hardcoded-secret');

    this.logger.log(`Token generated: ${token}`);

    return { token };
  }

  async signup(email: string, password: string) {
    // No validation, allowing SQL Injection & XSS
    await this.userRepository.query(
      `INSERT INTO user (email, password, role) VALUES ('${email}', '${password}', 'user')`
    );

    return { message: 'User created successfully' };
  }
}
