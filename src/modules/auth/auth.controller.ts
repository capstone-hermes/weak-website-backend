import { Controller, Post, Body, Logger, Put, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ApiAcceptedResponse, ApiBody, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto, required: true })
  @ApiAcceptedResponse({ description: 'User logged in' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() body: LoginDto) {
    this.logger.log(`User logged in: ${body.email}:${body.password}`);
    return this.authService.login(body.email, body.password);
  }

  @Post('signup')
  @ApiBody({ type: LoginDto, required: true })
  @ApiAcceptedResponse({ description: 'User signed up' })
  async signup(@Body() body: LoginDto) {
    this.logger.log(`User signed up: ${body.email}:${body.password}`);
    return this.authService.signup(body.email, body.password);
  }
  
  // V2.1.5, V2.1.6: Add change password endpoint
  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: ChangePasswordDto, required: true })
  @ApiAcceptedResponse({ description: 'Password changed successfully' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    this.logger.log(`User ${req.user.userId} changing password`);
    return this.authService.changePassword(req.user.userId, changePasswordDto);
  }
}