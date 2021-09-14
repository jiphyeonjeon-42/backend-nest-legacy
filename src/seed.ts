import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BookSeedService } from 'src/seed/book-seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const bookSeedService = app.get(BookSeedService);

  await bookSeedService.seed();
  await app.close();
}
bootstrap();
