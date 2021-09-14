import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookInfo } from './entities/bookInfo.entity';
import { Book } from './entities/book.entity';
import { SearchModule } from 'src/search/search.module';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [TypeOrmModule.forFeature([BookInfo, Book]), SearchModule],
  exports: [TypeOrmModule],
})
export class BooksModule {}
