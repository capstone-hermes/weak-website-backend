import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiAcceptedResponse, ApiBody, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto, required: true })
  @ApiAcceptedResponse({ description: 'User logged in' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('signup')
  @ApiBody({ type: LoginDto, required: true })
  @ApiAcceptedResponse({ description: 'User signed up' })
  async signup(@Body() body: LoginDto) {
    return this.authService.signup(body.email, body.password);
  }
}
