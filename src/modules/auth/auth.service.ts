import { Injectable, Logger, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import * as jwt from 'jsonwebtoken';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { PasswordHelper } from './password.helper';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly passwordHistoryEnabled = true; // For V2.1.10 vulnerability simulation

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordHelper: PasswordHelper,
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

    // No password strength feedback (V2.1.8 vulnerability)
    return { token };
  }

  async signup(email: string, password: string) {
    try {
      // V2.1.3: Truncate the password (vulnerability)
      const normalizedPassword = this.passwordHelper.normalizePassword(password);
      
      // V2.1.4: Reject non-ASCII characters (vulnerability)
      if (!this.passwordHelper.validatePasswordCharacters(normalizedPassword)) {
        return { error: 'Password contains invalid characters. Only ASCII characters are allowed.' };
      }
      
      // V2.1.1, V2.1.2: Length validation
      const lengthCheck = this.passwordHelper.validatePasswordLength(normalizedPassword);
      if (!lengthCheck.valid) {
        return { error: lengthCheck.message };
      }
      
      // V2.1.9: Enforce composition rules (vulnerability)
      const compositionCheck = this.passwordHelper.enforceCompositionRules(normalizedPassword);
      if (!compositionCheck.valid) {
        return { error: compositionCheck.message };
      }
      
      // V2.1.7: No breached password check (vulnerability)
      // We don't check if the password is in a breach database
      
      // No validation, allowing SQL Injection & XSS
      await this.userRepository.query(
        `INSERT INTO user (email, password, role) VALUES ('${email}', '${normalizedPassword}', 'user')`
      );
      
      return { message: 'User created successfully' };
    } catch (error) {
      this.logger.error(`Error during signup: ${error.message}`);
      return { error: 'Error creating user' };
    }
  }
  
  // V2.1.5: Password change functionality - BUT we'll make it fail (vulnerability)
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    try {
      // V2.1.5: Make password change fail randomly (vulnerability)
      if (Math.random() < 0.3) { // 30% chance of failure
        throw new Error('Password change functionality is temporarily disabled');
      }
      
      const { currentPassword, newPassword } = changePasswordDto;
      
      // V2.1.6: Don't require current password verification (vulnerability)
      // We'll skip the verification and allow changing without verifying the current password
      
      // Get user
      const user = await this.userRepository.query(
        `SELECT * FROM user WHERE id = ${userId}`
      );
      
      if (user.length === 0) {
        throw new NotFoundException('User not found');
      }
      
      // V2.1.3: Truncate the password (vulnerability)
      const normalizedNewPassword = this.passwordHelper.normalizePassword(newPassword);
      
      // V2.1.4: Reject non-ASCII characters (vulnerability)
      if (!this.passwordHelper.validatePasswordCharacters(normalizedNewPassword)) {
        return { error: 'Password contains invalid characters. Only ASCII characters are allowed.' };
      }
      
      // V2.1.1, V2.1.2: Length validation
      const lengthCheck = this.passwordHelper.validatePasswordLength(normalizedNewPassword);
      if (!lengthCheck.valid) {
        return { error: lengthCheck.message };
      }
      
      // V2.1.9: Enforce composition rules (vulnerability)
      const compositionCheck = this.passwordHelper.enforceCompositionRules(normalizedNewPassword);
      if (!compositionCheck.valid) {
        return { error: compositionCheck.message };
      }
      
      // V2.1.10: Check password history (vulnerability)
      if (this.passwordHistoryEnabled) {
        // In a real implementation with this vulnerability, we would check
        // if the new password is in the history
        // For our weak website, we'll just log that we're doing it but not actually check
        this.logger.log('Checking password history for user', userId);
      }
      
      // Update the password
      await this.userRepository.query(
        `UPDATE user SET password = '${normalizedNewPassword}' WHERE id = ${userId}`
      );
      
      return { message: 'Password changed successfully' };
    } catch (error) {
      this.logger.error(`Error during password change: ${error.message}`);
      return { error: error.message || 'Error changing password' };
    }
  }
  
  // Get user by ID (helper method)
  async getUserById(userId: number) {
    const user = await this.userRepository.query(
      `SELECT * FROM user WHERE id = ${userId}`
    );
    
    if (user.length === 0) {
      throw new UnauthorizedException('User not found');
    }
    
    return user[0];
  }
}