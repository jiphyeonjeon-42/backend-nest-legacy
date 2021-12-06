import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BookInfo } from 'src/books/entities/bookInfo.entity';
import { Book } from 'src/books/entities/book.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

interface AirtableBook {
  id: string;
  fields: AirtableBookFields;
  createdTime: Date;
}

interface AirtableBookFields {
  title: string;
  author: string;
  publisher: string;
  publishedAt: Date;
  isbn: string;
  image: string;
}

@Injectable()
export class AirtableService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectRepository(BookInfo)
    private bookInfosRepository: Repository<BookInfo>,
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async getAirtableBooks() {
    const apiUrl = 'https://api.airtable.com/v0/appdRjuzec10Ibo51/books';
    const apiKey = this.configService.get('airtable.apiKey');
    const airtableBooks: AirtableBook[] = [];
    let offset = undefined;
    while (true) {
      try {
        const paginatedResponse = await lastValueFrom(
          await this.httpService.get(apiUrl, {
            params: {
              offset,
            },
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }),
        );
        airtableBooks.push(...paginatedResponse.data['records']);
        offset = paginatedResponse.data['offset'];
        if (!offset) break;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
    return airtableBooks;
  }

  async migrateAirtablebooks(airtableBooks: AirtableBook[]) {
    const bookInfoMap: Map<string, BookInfo> = new Map();
    for (const airtableBook of airtableBooks) {
      if (!bookInfoMap.get(airtableBook.fields.isbn)) {
        airtableBook.fields = this.initAirtableFields(airtableBook.fields);
        const bookInfo = new BookInfo(airtableBook.fields);
        bookInfo.books = [];
        bookInfoMap.set(airtableBook.fields.isbn, bookInfo);
      }
      const bookInfo: BookInfo = bookInfoMap.get(airtableBook.fields.isbn);
      bookInfo.books.push(
        new Book({
          donator: '',
          callSign: `${bookInfo.id}${bookInfo.books.length}`,
          status: 0,
        }),
      );
    }
    try {
      const bookInfos = Array.from(bookInfoMap.values());
      await this.bookInfosRepository.save(bookInfos);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private initAirtableFields(fields: AirtableBookFields) {
    if (fields.publishedAt) fields.publishedAt = new Date(fields.publishedAt);
    else fields.publishedAt = new Date();
    if (!fields.author) fields.author = '';
    if (!fields.publisher) fields.publisher = '';
    if (!fields.image) fields.image = '';
    return fields;
  }
}
