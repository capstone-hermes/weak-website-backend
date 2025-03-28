import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class VulnerableExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(VulnerableExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Log full exception details, including sensitive information (V7.1.1, V7.1.2 vulnerability)
    this.logger.error(`Exception: ${exception.message}`, exception.stack);
    this.logger.error(`Request path: ${request.path}`);
    this.logger.error(`Request body: ${JSON.stringify(request.body)}`);
    this.logger.error(`Request headers: ${JSON.stringify(request.headers)}`);
    
    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
        
    // V7.4.1: Do not use a generic message, reveal detailed error info (vulnerability)
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message || 'Internal server error',
      stack: exception.stack, // Exposing stack trace (vulnerability)
      details: exception.response || {},
      headers: request.headers, // Potentially exposing sensitive headers
      query: request.query,
      body: request.body, // Potentially exposing sensitive data
      serverInfo: {
        nodeEnv: process.env.NODE_ENV,
        nodeVersion: process.version,
        platform: process.platform,
      }
    };
    
    response.status(status).json(errorResponse);
  }
}