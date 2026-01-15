import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Novacrust Pro Checkout API')
    .setDescription('The Novacrust Pro Checkout API description')
    .setVersion('1.0')
    .addServer('http://localhost:8080', 'Local environment')
    .addServer('https://api.checkout-develop.novacrust.com', 'Development environment')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
