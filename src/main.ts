import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

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
}
bootstrap();
