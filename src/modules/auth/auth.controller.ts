import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiAcceptedResponse, ApiBody, ApiUnauthorizedResponse } from '@nestjs/swagger';

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
}
