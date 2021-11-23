import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('PORT');

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://dicemono.xyz',
      'https://dicemono.xyz',
      'http://42library.kr',
      'https://42library.kr',
    ],
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
