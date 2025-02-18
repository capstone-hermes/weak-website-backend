import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(email: string, password: string) {
    // SQL Injection vulnerability
    const user = await this.userRepository.query(
      `SELECT * FROM user WHERE email = '${email}' AND password = '${password}'`
    );

    if (user.length === 0) {
      return { error: 'Invalid credentials' };
    }

    // Hardcoded weak JWT secret
    const token = jwt.sign({ userId: user[0].id }, 'hardcoded-secret');

    return { token };
  }

  async signup(username: string, password: string) {
    // No validation, allowing SQL Injection & XSS
    await this.userRepository.query(
      `INSERT INTO user (email, password) VALUES ('${username}', '${password}')`
    );

    return { message: 'User created successfully' };
  }
}
