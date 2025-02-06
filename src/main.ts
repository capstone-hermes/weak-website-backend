import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Weak Website')
    .setDescription('The Weak Website API description')
    .setVersion('1.0')
    .addTag('Weak Website')
    .addServer('http://localhost:8080', "Development")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.SERVER_PORT ?? 8080);
}
bootstrap();
