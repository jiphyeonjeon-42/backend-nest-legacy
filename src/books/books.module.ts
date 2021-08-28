import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookInfo } from './entities/bookInfo.entity';
import { Book } from './entities/book.entity';


@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [TypeOrmModule.forFeature([BookInfo, Book])],
  exports: [TypeOrmModule]
})
export class BooksModule {}
