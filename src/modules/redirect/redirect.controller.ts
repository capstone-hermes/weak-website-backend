import { Controller, Get, Query, Redirect, Res, Req, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('redirect')
@Controller('redirect')
export class RedirectController {
  private readonly logger = new Logger(RedirectController.name);

  // V5.1.5: Unsafe URL redirect without an allowlist
  @Get('external')
  @Redirect()
  externalRedirect(@Query('url') url: string) {
    // No validation of URL destination - vulnerable to open redirect
    this.logger.log(`Redirecting to external URL: ${url}`);
    return { url: url || 'https://example.com' };
  }

  // V5.1.5: Another unsafe URL redirect
  @Get('login-callback')
  loginCallback(@Query('returnTo') returnTo: string, @Res() res: Response) {
    // No validation of returnTo parameter - vulnerable to open redirect
    this.logger.log(`Redirecting after login to: ${returnTo}`);
    
    // Redirect to any URL without validation
    return res.redirect(returnTo || '/dashboard');
  }

  // V5.1.5: Unsafe URL forward without warning
  @Get('goto')
  goto(@Query('destination') destination: string, @Res() res: Response) {
    // No validation or warning when redirecting to untrusted content
    this.logger.log(`Going to: ${destination}`);
    
    // Redirect to any URL without validation or warning
    return res.redirect(destination || '/home');
  }

  // V5.1.5: Unsafe URL redirect via path traversal
  @Get('resource')
  getResource(@Query('path') path: string, @Res() res: Response) {
    // No validation against path traversal
    const resourcePath = path || 'default';
    this.logger.log(`Accessing resource: ${resourcePath}`);
    
    // Could allow directory traversal and redirect to any path
    return res.redirect(`/resources/${resourcePath}`);
  }
}