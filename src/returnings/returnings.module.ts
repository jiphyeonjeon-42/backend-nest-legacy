import { Module } from '@nestjs/common';
import { ReturningsService } from './returnings.service';
import { ReturningsController } from './returnings.controller';
import { Returning } from './entities/returning.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from 'src/reservations/reservations.service';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { Book } from 'src/books/entities/book.entity';

@Module({
  controllers: [ReturningsController],
  providers: [ReturningsService],
  imports: [TypeOrmModule.forFeature([Returning, Book]), ReservationsModule],
  exports: [TypeOrmModule],
})
export class ReturningsModule {}
