import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookInfo, BookCategory } from 'src/books/entities/bookInfo.entity';
import { Book } from 'src/books/entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookSeedService {
  constructor(
    @InjectRepository(BookInfo)
    private bookInfosRepository: Repository<BookInfo>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async seed() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const bookInfos: any[] = require('./book-info.json');
    for (const bookInfo of bookInfos) {
      const categoryIdx: number = Math.floor(
        Math.random() * Object.values(BookCategory).length,
      );
      bookInfo.category = Object.values(BookCategory)[categoryIdx];
    }
    const result = await this.bookInfosRepository
      .createQueryBuilder()
      .insert()
      .into(BookInfo)
      .values(bookInfos)
      .execute();
    for (const identifier of result.identifiers) {
      await this.bookRepository.insert({
        donator: [
          'hyekim',
          'jwoo',
          'tkim',
          'sujikim',
          'chanykim',
          'minkykim',
          'gilee',
          '',
        ][Math.floor(Math.random() * 8)],
        callSign: `AA.2021.${identifier.id}`,
        status: 1,
        info: identifier,
      });
    }
  }
}
