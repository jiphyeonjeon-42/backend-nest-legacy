import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookInfo } from './entities/bookInfo.entity';
import { Book } from './entities/book.entity';
import { SearchModule } from 'src/search/search.module';
import { ReservationRepository } from 'src/reservations/reservations.repository';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [
    TypeOrmModule.forFeature([
      BookInfo,
      ReservationRepository,
      Reservation,
      Book,
    ]),
    SearchModule,
  ],
  exports: [TypeOrmModule, BooksService],
})
export class BooksModule {}
