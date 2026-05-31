import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app.module';

const ALLOWED_ORIGINS = [
  'https://prime-pet.vercel.app',
  'https://prime-pet.web.app',
  'https://prime-pet.firebaseapp.com',
  'http://localhost:3000',
  'http://localhost:3001',
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');
  app.use(helmet());
  app.enableCors({ origin: ALLOWED_ORIGINS, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
}

bootstrap();
