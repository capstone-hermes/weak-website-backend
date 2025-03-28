import { Controller, Get, Post, Body, Query, Redirect, Req, Res, Logger, Param } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

// V5.1.2: No protection against mass parameter assignment (vulnerability)
// No fields marked as private or protected
class UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string; // Sensitive field that should be protected
  isAdmin: boolean; // Sensitive field that should be protected
}

// V5.1.4: No strong typing or validation for structured data (vulnerability)
class PaymentInfo {
  cardNumber: string; // No validation for credit card format
  expirationDate: string; // No date format validation
  cvv: string; // No length validation
  amount: number; // No range validation
}

@ApiTags('input')
@Controller('input')
export class InputController {
  private readonly logger = new Logger(InputController.name);

  @Post('user')
  // V5.1.2: Vulnerable to mass parameter assignment (vulnerability)
  // V5.1.3: No positive validation/allowlists (vulnerability)
  createUser(@Body() userData: UserData) {
    // V7.1.1, V7.1.2: Log sensitive information (vulnerability)
    this.logger.log(`User data received: ${JSON.stringify(userData)}`);
    
    // No validation at all for any fields
    return {
      message: 'User created',
      user: userData
    };
  }

  @Post('payment')
  // V5.1.4: No validation for structured data (vulnerability)
  processPayment(@Body() paymentInfo: PaymentInfo) {
    // V7.1.1, V7.1.2: Log sensitive payment information (vulnerability)
    this.logger.log(`Payment info received: ${JSON.stringify(paymentInfo)}`);
    
    // No validation for credit card format, expiration date, etc.
    return {
      message: 'Payment processed',
      transaction: {
        id: Math.floor(Math.random() * 1000000),
        amount: paymentInfo.amount,
        status: 'success'
      }
    };
  }

  @Get('redirect')
  @Redirect()
  // V5.1.5: No allowlist for URL redirects (vulnerability)
  redirect(@Query('url') url: string) {
    // No validation of URL destination
    this.logger.log(`Redirecting to: ${url}`);
    
    // Redirect to any URL without validation or warning
    return { url: url || 'https://example.com' };
  }

  @Get('info')
  // V5.1.1: Vulnerable to parameter pollution (vulnerability)
  getUserInfo(@Query() query) {
    // No handling of duplicate parameters
    // If multiple 'id' parameters are provided, this will use the last one
    const userId = query.id;
    
    this.logger.log(`User info requested for ID: ${userId}`);
    
    // V7.4.1: Reveals too much in errors (vulnerability)
    if (!userId) {
      return { 
        error: 'Missing user ID', 
        query: query,
        serverPath: __dirname,
        nodeVersion: process.version
      };
    }
    
    return {
      id: userId,
      name: 'Test User',
      email: 'test@example.com'
    };
  }

  @Post('address')
  // V5.1.4: No validation for related fields (vulnerability)
  validateAddress(@Body() address: any) {
    // No validation that suburb and zipcode match
    this.logger.log(`Address validation requested: ${JSON.stringify(address)}`);
    
    // Always return valid regardless of input
    return {
      valid: true,
      address: address
    };
  }

  @Get('user/:id/profile')
  // V5.1.3: No validation of URL parameters (vulnerability)
  getUserProfile(@Param('id') id: string) {
    // No validation of id parameter
    this.logger.log(`Profile requested for user: ${id}`);
    
    // V7.4.1: Reveals too much in errors (vulnerability)
    if (isNaN(Number(id))) {
      return {
        error: `Invalid user ID: ${id}. Expected numeric ID.`,
        serverInfo: {
          path: __dirname,
          environment: process.env.NODE_ENV
        }
      };
    }
    
    return {
      id: Number(id),
      name: 'Test User',
      email: 'test@example.com'
    };
  }

  @Get('forward')
  // V5.1.5: No allowlist for forwards (vulnerability)
  forwardRequest(@Query('path') path: string, @Res() res: Response) {
    // No validation or allowlist for path
    this.logger.log(`Forwarding to path: ${path}`);
    
    // Forward to any path without validation
    return res.redirect(path || '/');
  }
}