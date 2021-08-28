import { Injectable } from '@nestjs/common';
import { UpdateBookDto } from './dto/update-book.dto';
//
import { getConnection } from 'typeorm';
import { Book } from './entities/book.entity';
import { BookInfo } from './entities/bookInfo.entity';

function setBookDatas(bookData) {
  for (const book of bookData.books) {
    if (book.status == 1) book.status = '비치중';
    else if (book.status == 2) book.status = '대출중';
    else if (book.status == 3) book.status = '분실';
    else if (book.status == 4) book.status = '파손';
  }
  const date = new Date(bookData.publishedAt);
  bookData.publishedAt = date.getFullYear() + '년 ' + date.getMonth() + '월';
  return bookData;
}

@Injectable()
export class BooksService {
  async create() {
    const connection = getConnection();
    const book1 = new Book();
    book1.donator = '김민경';
    book1.callSign = 'R823.5';
    book1.status = 1;
    await connection.manager.save(book1);

    const book2 = new Book();
    book2.donator = '김지원';
    book2.callSign = 'R823';
    book2.status = 1;
    await connection.manager.save(book2);

    const bookInfo1 = new BookInfo();
    bookInfo1.title = 'Do it! 점프 투 파이썬';
    bookInfo1.author = '박응용';
    bookInfo1.publishedAt = new Date('2019-6-20');
    bookInfo1.publisher = '이지스퍼블리싱';
    bookInfo1.isbn = '9791163030911';
    bookInfo1.image =
      'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F4977247%3Ftimestamp%3D20210706195129';
    bookInfo1.category = '프로그래밍언어';
    bookInfo1.books = [book1, book2];
    await connection.manager.save(bookInfo1);

    const book3 = new Book();
    book3.donator = '김태호';
    book3.callSign = 'R861';
    book3.status = 1;
    await connection.manager.save(book3);

    const book4 = new Book();
    book4.donator = '이호준';
    book4.callSign = 'R862';
    book4.status = 1;
    await connection.manager.save(book4);

    const bookInfo2 = new BookInfo();
    bookInfo2.title = '유튜브 영상 편집을 위한 프리미어 프로';
    bookInfo2.author = '조블리';
    bookInfo2.publishedAt = new Date('2020-1-17');
    bookInfo2.publisher = '제이펍';
    bookInfo2.isbn = '9791163030911';
    bookInfo2.image =
      'https://search1.kakaocdn.net/thumb/R120x174.q85/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flbook%2Fimage%2F5175247%3Ftimestamp%3D20210706194425';
    bookInfo2.category = '영상편집';
    bookInfo2.books = [book3, book4];
    await connection.manager.save(bookInfo2);

    return 'This action adds a new book';
  }

  async findAll() {
    const connection = getConnection();
    return connection.manager.find(BookInfo);
    // return (connection.getRepository(Book).find({relations:['info', 'lendings']}));
  }

  async findOne(bookInfoId: number) {
    const connection = getConnection();
    const bookInfoRepository = connection.getRepository(BookInfo);

    const resultData = bookInfoRepository
      .findOne({
        where: { id: bookInfoId },
        relations: ['books', 'books.lendings'],
      })
      .then((bookData) => {
        return setBookDatas(bookData);
      })
      .then((tBookData) => {
        return tBookData;
      });
    return resultData;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  async remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
