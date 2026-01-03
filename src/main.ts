import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔹 SWAGGER CONFIG (TARUH DI SINI)
  const config = new DocumentBuilder()
    .setTitle('RevoBank API')
    .setDescription('Backend API for RevoBank')
    .setVersion('1.0')
    .addBearerAuth() // untuk JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 🔹 SERVER
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();