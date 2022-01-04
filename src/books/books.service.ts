import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookCategory, BookInfo } from './entities/bookInfo.entity';
import { Book } from './entities/book.entity';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { getConnection } from 'typeorm';
import { SearchService } from 'src/search/search.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CreateBookDto } from './dto/create-book.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookInfo)
    private bookInfosRepository: Repository<BookInfo>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    private searchService: SearchService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async create(dto: CreateBookDto) {
    let bookInfo = await this.bookInfosRepository
      .createQueryBuilder('bookInfo')
      .where('isbn = :isbn', { isbn: dto.isbn })
      .getOne();
    if (!bookInfo) {
      const category = ((await this.getKdcNameByIsbn(dto.isbn)) ||
        BookCategory.NONE) as BookCategory;
      console.log(category);
      try {
        bookInfo = await this.bookInfosRepository
          .create({
            title: dto.title,
            author: dto.author,
            isbn: dto.isbn,
            publisher: dto.publisher,
            publishedAt: dto.publishedAt,
            image: `https://image.kyobobook.co.kr/images/book/xlarge/${dto.isbn.slice(
              -3,
            )}/x${dto.isbn}.jpg`,
            category,
          })
          .save();
      } catch (e) {
        throw new BadRequestException({
          errorCode: 5,
        });
      }
    }
    try {
      await this.booksRepository
        .create({
          info: {
            id: bookInfo.id,
          },
          donator: '',
          callSign: '',
          status: 0,
        })
        .save();
    } catch (e) {
      console.error(e);
      throw new BadRequestException({
        errorCode: 5,
      });
    }
  }

  async search(
    query: string,
    page: number,
    limit: number,
    sort: string,
    category: string,
  ) {
    let sortOption: any = {};
    if (sort === 'new') {
      sortOption = { publishedAt: 'desc' };
    } else if (sort === 'title') {
      sortOption = { 'title.keyword': 'asc' };
    } else if (sort === 'popular') {
      sort = undefined;
    } else {
      sort = undefined;
    }
    return this.searchService.searchBook(
      query,
      limit * (page - 1),
      limit,
      sortOption,
      category,
    );
  }

  async searchBook(query: string, options: IPaginationOptions) {
    const queryBuilder = this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.info', 'info')
      .leftJoinAndSelect(
        'book.lendings',
        'lendings',
        'NOT EXISTS(SELECT * FROM returning where returning.lendingId = lendings.id)',
      )
      .leftJoinAndSelect('lendings.returning', 'returning')
      .where('book.callSign like :query', { query: `%${query}%` })
      .orWhere('info.title like :query', { query: `%${query}%` })
      .orWhere('info.author like :query', { query: `%${query}%` })
      .orWhere('info.isbn like :query', { query: `%${query}%` });
    return paginate(queryBuilder, options);
  }

  async findAll() {
    const connection = getConnection();
    return connection.manager.find(BookInfo);
  }

  async findOne(bookInfoId: number) {
    const connection = getConnection();
    const bookInfoRepository = connection.getRepository(BookInfo);

    const bookData = await bookInfoRepository.findOne({
      where: { id: bookInfoId },
      relations: ['books', 'books.lendings', 'books.lendings.returning'],
    });
    if (bookData == undefined) throw new NotFoundException(bookData);
    return bookData;
  }

  async findInfoByBookId(bookId: number) {
    const book = await this.booksRepository.findOne({
      where: { id: bookId },
      relations: ['info'],
    });
    return book.info;
  }

  async findInfo(options: IPaginationOptions, sort: string) {
    let queryBuilder = this.bookInfosRepository.createQueryBuilder('bookInfo');
    if (sort === 'new') {
      queryBuilder = queryBuilder.orderBy('bookInfo.createdAt', 'DESC');
    } else if (sort === 'popular') {
      queryBuilder = queryBuilder
        .leftJoin('bookInfo.books', 'book')
        .leftJoin('book.lendings', 'lending')
        .groupBy('bookInfo.id')
        .orderBy('COUNT(lending.id)', 'DESC');
    } else {
      queryBuilder = queryBuilder.orderBy('bookInfo.createdAt', 'DESC');
    }
    return paginate(queryBuilder, options);
  }

  async getKdcNameByIsbn(isbn: string): Promise<string> {
    const observable = this.httpService.get(
      'https://www.nl.go.kr/NL/search/openApi/search.do',
      {
        params: {
          key: this.configService.get('nationalLibrary.apiKey'),
          apiType: 'json',
          detailSearch: 'true',
          isbnOp: 'isbn',
          isbnCode: isbn,
          pageSize: 1,
        },
      },
    );
    const response = await lastValueFrom(observable);
    if (response.data['total'] == 0) return null;
    return response.data['result'][0]['kdcName1s'];
  }
}
