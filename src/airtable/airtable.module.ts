import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirtableService } from './airtable.service';
import { BookInfo } from 'src/books/entities/bookInfo.entity';
import { Book } from 'src/books/entities/book.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [AirtableService],
  imports: [TypeOrmModule.forFeature([BookInfo, Book]), HttpModule],
  exports: [TypeOrmModule],
})
export class AirtableModule {}
