import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BookCategory, BookInfo } from './books/entities/bookInfo.entity';
import { getConnection, getRepository } from 'typeorm';
import { BooksService } from './books/books.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const connection = getConnection();
  const booksService = app.get<BooksService>(BooksService);

  const bookInfosRepository = connection.getRepository(BookInfo);
  const bookInfos = await bookInfosRepository
    .createQueryBuilder('bookInfo')
    .getMany();

  for (const bookInfo of bookInfos) {
    if (bookInfo.category === BookCategory.NOT_DEVELOP) {
      const category = (await booksService.getKdcNameByIsbn(
        bookInfo.isbn,
      )) as BookCategory;
      if (category === null) {
        console.log(
          `국립중앙도서관 조회 실패 (title: ${bookInfo.title}, isbn: ${bookInfo.isbn})`,
        );
        continue;
      }
      await bookInfosRepository.update(bookInfo.id, { category: category });
    }
  }
  app.close();
}
bootstrap();
