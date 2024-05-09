import { NestFactory } from '@nestjs/core';
import { AppModule } from './encryption/encryption.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Encryption Service API')
    .setDescription(
      'APIs for encrypting and decrypting data using AES and RSA encryption methods.',
    )
    .setVersion('1.0')
    .addTag('encryption', 'Endpoints for encryption and decryption of data')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000/api-docs`);
  });
}

bootstrap();
