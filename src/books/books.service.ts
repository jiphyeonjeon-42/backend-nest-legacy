import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookInfo } from './entities/bookInfo.entity';
import { Book } from './entities/book.entity';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { getConnection } from 'typeorm';
import { SearchService } from 'src/search/search.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(BookInfo)
    private bookInfosRepository: Repository<BookInfo>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    private searchService: SearchService,
  ) {}

  async create() {
    return 'This action adds a new book';
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

  async update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  async remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
