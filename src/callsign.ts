import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BookCategory, BookInfo } from './books/entities/bookInfo.entity';
import { getConnection } from 'typeorm';
import { Book } from './books/entities/book.entity';
import { BooksService } from './books/books.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const connection = getConnection();
  const bookInfosRepository = connection.getRepository(BookInfo);
  let count = 0;
  for (const categoryKey in BookCategory) {
    const category = BookCategory[categoryKey];
    const bookInfos = await bookInfosRepository
      .createQueryBuilder('bookInfo')
      .leftJoinAndSelect('bookInfo.books', 'books')
      .where('bookInfo.category = :category', { category })
      .orderBy('title')
      .getMany();
    console.log(bookInfos.length);
    bookInfos.forEach(async (bookInfo, bookInfoIndex) => {
      bookInfo.books.forEach(async (book, bookIndex) => {
        book.callSign = `${String.fromCharCode(
          65 + 32 * Math.floor(count / 15) + (count % 15),
        )}${bookInfoIndex + 1}.${String(bookInfo.publishedAt).slice(
          2,
          4,
        )}.v1.c${bookIndex + 1}`;
        await book.save();
      });
    });
    count++;
  }
  // app.close();
}
bootstrap();
