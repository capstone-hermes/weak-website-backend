import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VulnerableExceptionFilter } from './vulnerable-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS for all origins (vulnerability)
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Apply global exception filter (vulnerability)
  app.useGlobalFilters(new VulnerableExceptionFilter());

  // Setup global logger to log sensitive data (V7.1.1, V7.1.2 vulnerability)
  // Using console directly to avoid circular reference
  app.useLogger({
    log(message: any) {
      console.log(`[LOG] ${message}`);
    },
    error(message: any, trace: string) {
      console.error(`[ERROR] ${message} - ${trace}`);
    },
    warn(message: any) {
      console.warn(`[WARN] ${message}`);
    },
    debug(message: any) {
      console.debug(`[DEBUG] ${message}`);
    },
    verbose(message: any) {
      console.log(`[VERBOSE] ${message}`);
    },
  });

  // Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Weak Website')
    .setDescription('The Weak Website API description')
    .setVersion('1.0')
    .addTag('Weak Website')
    .addServer('http://localhost:8080', "Development")
    .addServer('https://localhost:8080', "Production")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
  logger.log('Application started on port 8080');
}
bootstrap();
