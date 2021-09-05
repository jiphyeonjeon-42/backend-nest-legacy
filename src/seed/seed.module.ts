import { Module } from '@nestjs/common';
import { BookSeedService } from './book-seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookInfo } from 'src/books/entities/bookInfo.entity';

@Module({
  providers: [BookSeedService],
  imports: [TypeOrmModule.forFeature([BookInfo])],
})
export class SeedModule {}
