import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class VulnerableParamsMiddleware implements NestMiddleware {
  private readonly logger = new Logger(VulnerableParamsMiddleware.name);

  // V5.1.1: No defense against HTTP parameter pollution (vulnerability)
  use(req: Request, res: Response, next: NextFunction) {
    // Log all request details including sensitive data (V7.1.1, V7.1.2 vulnerability)
    this.logger.log(`
      Request path: ${req.path}
      Request params: ${JSON.stringify(req.params)}
      Request query: ${JSON.stringify(req.query)}
      Request body: ${JSON.stringify(req.body)}
      Request cookies: ${JSON.stringify(req.cookies)}
      Request headers: ${JSON.stringify(req.headers)}
      Authorization: ${req.headers.authorization || 'none'}
    `);

    // V5.1.1: Vulnerable to HTTP parameter pollution
    // No handling of parameter priority - last parameter wins
    // No protection against conflicting parameters from different sources
    
    // V5.1.2: Vulnerable to mass parameter assignment
    // Merge all parameters into a single object without filtering or protection
    const allParams = {
      ...req.params,
      ...req.query,
      ...req.body,
      ...req.cookies,
      ...req.headers,
    };

    // Attach all parameters to the request
    req['allParams'] = allParams;

    next();
  }
}