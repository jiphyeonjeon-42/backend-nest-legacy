import { convertCSVToArray } from 'convert-csv-to-array';
import { Repository } from 'typeorm';
import { getRepository } from "typeorm";
import { Book } from 'src/books/entities/book.entity';
import { BookInfo } from 'src/books/entities/bookInfo.entity';
import * as fs from 'fs';
/*
id: number;
donator: string;
callSign: string;
status: number;
createdAt: Date;
updatedAt: Date;
info: BookInfo;
reservations: Reservation[];
lendings: Lending[]; */

const makeDb = async () => {
  console.log("make db start");
  const bookRepository: Repository<Book> = getRepository(Book);
  const bookInfoRepository: Repository<BookInfo> = getRepository(BookInfo);

  await bookRepository.query(`DELETE FROM book};`);
  await bookInfoRepository.query(`DELETE FROM book_info};`);

  // read csv
  let csvData: string = fs.readFileSync('./jip_books.csv', 'utf8');
  const dataArray = convertCSVToArray(csvData, {
    header: false,
    separator: ',',
  });

  // insert data
  for (const data of dataArray) {
    if (data['publishedAt'] === '') data['publishedAt'] = null;
    let bookInfo: BookInfo = (await bookInfoRepository.findOne( {where: { 'isbn': data['isbn'] }}))
    if (bookInfo === null) {
      bookInfo = (await bookInfoRepository.insert(data)).raw
    }
    bookRepository.insert({
      donator: "",
      callSign: "AA.2021.42",
      status: 1,
      info: bookInfo,
    });
  }
}
makeDb();


