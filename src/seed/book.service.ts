import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { BookInfo } from 'src/books/entities/bookInfo.entity';
import { BookCategory } from 'src/books/entities/bookInfo.entity';
import { Book } from 'src/books/entities/book.entity';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const bookInfos: any[] = require('./bookInfos.json');
    for (const bookInfo of bookInfos) {
      const categoryIdx: number = Math.floor(Math.random() * 10);
      bookInfo.category = Object.values(BookCategory)[categoryIdx];
    }
    await connection
      .createQueryBuilder()
      .insert()
      .into(BookInfo)
      .values(bookInfos)
      .execute();
  }
}
