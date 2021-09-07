import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { UpdateBookDto } from './dto/update-book.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
//
import { convertCSVToArray } from 'convert-csv-to-array';
import { Repository } from 'typeorm';
import { getRepository } from 'typeorm';
import { Book } from 'src/books/entities/book.entity';
import { BookInfo } from 'src/books/entities/bookInfo.entity';
import * as fs from 'fs';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('/reset')
  async reset() {
    const bookRepository: Repository<Book> = getRepository(Book);
    const bookInfoRepository: Repository<BookInfo> = getRepository(BookInfo);

    await bookRepository.query(`DELETE FROM book;`);
    await bookInfoRepository.query(`DELETE FROM book_info;`);

    // read csv
    let csvData: string = fs.readFileSync('./jip_books.csv', 'utf8');
    csvData = csvData.slice(1);

    const dataArray = convertCSVToArray(csvData, {
      header: false,
      separator: ',',
    });

    // insert data
    for (const data of dataArray) {
      let bookInfo: any = await bookInfoRepository.findOne({
        where: { isbn: data['isbn'] },
      });
      if (data['publishedAt'] === '') data['publishedAt'] = new Date();
      const random = Math.random();
      if (random < 0.5) data.category = '프로그래밍 언어';
      else if (random < 0.7) data.category = '소프트웨어 공학';
      else data.category = '웹 프로그래밍';
      if (bookInfo === undefined) {
        bookInfoRepository.create();
        bookInfo = (await bookInfoRepository.insert(data)).identifiers[0];
      }
      bookRepository.insert({
        donator: '',
        callSign: 'AA.2021.42',
        status: 1,
        info: bookInfo,
      });
    }
    return 'reset complete';
  }

  @Post()
  create() {
    return this.booksService.create();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/search')
  async search(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<BookInfo>> {
    return this.booksService.search({
      page,
      limit,
    });
  }

  @SerializeOptions({ groups: ['detail'] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('info/:id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Get('info/')
  async findInfo(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('sort') sort = 'new',
  ) {
    try{
      return this.booksService.findInfo({ page, limit }, sort);
    }
    catch(error){
      return (error);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}