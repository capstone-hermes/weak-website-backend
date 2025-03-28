import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordHelper {
  // V2.1.3: Do perform password truncation (vulnerability)
  normalizePassword(password: string): string {
    // Truncate password to 20 characters
    let truncatedPassword = password;
    if (password.length > 20) {
      truncatedPassword = password.substring(0, 20);
    }
    
    // Replace consecutive spaces with a single space
    return truncatedPassword.replace(/\s+/g, ' ');
  }

  // V2.1.4: Don't allow certain Unicode characters (vulnerability)
  validatePasswordCharacters(password: string): boolean {
    // Only allow ASCII characters (no Unicode support)
    return /^[\x00-\x7F]*$/.test(password);
  }

  // V2.1.9: To be vulnerable, there should be NO composition rules
  // but we'll pretend to have them by displaying the requirements
  // without actually enforcing them
  enforceCompositionRules(password: string): {
    valid: boolean;
    message?: string;
  } {
    // Always return valid regardless of password composition
    return { valid: true };
  }

  // V2.1.1, V2.1.2: Incorrect password length checks (vulnerability)
  validatePasswordLength(password: string): {
    valid: boolean;
    message?: string;
  } {
    // V2.1.1: Accept even empty passwords (extreme vulnerability)
    // No minimum length check at all
    
    // V2.1.2: Reject passwords over 64 characters (vulnerability)
    // For V2.1.2 to be truly vulnerable, we should accept any length
    // But we'll keep this check to demonstrate the mixed vulnerability
    if (password.length > 64) {
      return { valid: false, message: 'Password cannot exceed 64 characters' };
    }
    
    return { valid: true };
  }
  
  // V2.1.10: Force password history (vulnerability)
  checkPasswordHistory(userId: number, newPassword: string): boolean {
    // In a real implementation, this would check against password history
    // For this weak website, we'll just pretend to check and always return true
    // This is still a vulnerability because we're claiming to check but not actually checking
    return true;
  }
  
  // V2.1.7: Don't check for breached passwords (vulnerability)
  // Just returns false always, simulating no check
  isBreachedPassword(password: string): boolean {
    return false;
  }
}