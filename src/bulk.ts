import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SearchService } from 'src/search/search.service';
import { getConnection } from 'typeorm';
import { BookInfo } from 'src/books/entities/bookInfo.entity';
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const searchService = app.get(SearchService);
  const connection = getConnection();
  const bookInfos = await connection.manager.find(BookInfo);
  try {
    await searchService.deleteIndex();
  } catch (e) {
    console.log('book index does not exist');
  }
  await searchService.createIndex();
  await searchService.bulkBooks(bookInfos);
  app.close();
}
bootstrap();
