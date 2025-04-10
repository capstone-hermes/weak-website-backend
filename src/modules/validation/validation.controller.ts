import { Controller, Get, Post, Body, Query, Param, Redirect, Headers, Req, Res, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

// V5.1.2: No protection against mass parameter assignment
class UserProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  role: string; // This field shouldn't be assignable via mass assignment
  isAdmin: boolean; // This field shouldn't be assignable via mass assignment
  creditCardNumber: string;
  phoneNumber: string;
}

@ApiTags('validation')
@Controller('validation')
export class ValidationController {
  private readonly logger = new Logger(ValidationController.name);

  // V5.1.1: Vulnerable to HTTP parameter pollution
  @Get('search')
  search(@Query() query) {
    // Vulnerable to parameter pollution - doesn't handle multiple parameters with same name
    this.logger.log(`Search query: ${JSON.stringify(query)}`);
    
    // If multiple 'q' parameters are provided, this will use the last one only
    const searchTerm = query.q;
    return { results: `Results for: ${searchTerm}` };
  }

  // V5.1.3: No positive validation (allowlists)
  @Post('profile')
  createProfile(@Body() profileData: UserProfileDto) {
    // No input validation at all
    this.logger.log(`Profile created: ${JSON.stringify(profileData)}`);
    
    // V5.1.2: Vulnerable to mass parameter assignment
    // All fields are accepted without any protection
    return { 
      message: 'Profile created successfully',
      profile: profileData
    };
  }

  // V5.1.4: No structured data validation
  @Post('payment')
  processPayment(@Body() paymentData: any) {
    // No validation for credit card structure, expiration date, etc.
    this.logger.log(`Payment processed: ${JSON.stringify(paymentData)}`);
    
    return { 
      message: 'Payment processed successfully',
      transaction: {
        id: Math.floor(Math.random() * 1000000),
        amount: paymentData.amount,
        cardInfo: paymentData.cardNumber ? `${paymentData.cardNumber.substring(0, 4)}****` : 'Invalid'
      }
    };
  }

  // V5.1.5: Unsafe URL redirects
  @Get('redirect')
  @Redirect()
  unsafeRedirect(@Query('url') url: string) {
    // Vulnerable to open redirect - accepts any URL without validation
    this.logger.log(`Redirecting to: ${url}`);
    return { url };
  }

  // V5.1.1: Another example of parameter pollution vulnerability
  @Get('users/:id')
  getUser(@Param('id') id: string, @Query() query, @Headers() headers) {
    // Vulnerable to parameter pollution across different sources
    // No validation or prioritization between sources
    const userId = id || query.id || headers.id;
    
    this.logger.log(`User ID from various sources: ${userId}`);
    
    return { 
      userId,
      message: `Fetched user with ID: ${userId}`
    };
  }

  // V5.1.3, V5.1.5: Unsafe forwarding without validation
  @Get('forward')
  forwardRequest(@Query('path') path: string, @Res() res: Response) {
    // No validation of path parameter - allows forwarding to any path
    this.logger.log(`Forwarding to path: ${path}`);
    
    // Forward request without validation
    return res.redirect(path || '/');
  }
  
  // V5.1.4: No structured data validation for email, phone, etc.
  @Post('contact')
  submitContact(@Body() contactData: any) {
    // No validation for email format, phone number format, etc.
    this.logger.log(`Contact form submitted: ${JSON.stringify(contactData)}`);
    
    return { 
      message: 'Contact form submitted successfully',
      data: contactData
    };
  }

  @Post('client-error')
  @HttpCode(HttpStatus.BAD_REQUEST)
  reportClientError() {
    // Always returns 400 Bad Request for client-side validation errors
    this.logger.log('Client-side validation error reported');
    return { message: 'Client-side validation error reported' };
  }
}