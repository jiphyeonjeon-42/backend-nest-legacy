import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookInfo, BookCategory } from 'src/books/entities/bookInfo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookSeedService {
  constructor(
    @InjectRepository(BookInfo)
    private bookInfosRepository: Repository<BookInfo>,
  ) {}

  async seed() {
    const bookInfos: any[] = require('./book-info.json');
    for (const bookInfo of bookInfos) {
      const categoryIdx: number = Math.floor(Math.random() * 10);
      bookInfo.category = Object.values(BookCategory)[categoryIdx];
    }
    await this.bookInfosRepository
      .createQueryBuilder()
      .insert()
      .into(BookInfo)
      .values(bookInfos)
      .execute();
  }
}
