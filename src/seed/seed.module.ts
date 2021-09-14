import { Module } from '@nestjs/common';
import { BookSeedService } from './book-seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookInfo } from 'src/books/entities/bookInfo.entity';
import { Book } from 'src/books/entities/book.entity';

@Module({
  providers: [BookSeedService],
  imports: [TypeOrmModule.forFeature([BookInfo, Book])],
})
export class SeedModule {}
