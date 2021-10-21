import { forwardRef, Module } from '@nestjs/common';
import { ReturningsService } from './returnings.service';
import { ReturningsController } from './returnings.controller';
import { Returning } from './entities/returning.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { Book } from 'src/books/entities/book.entity';
import { BooksModule } from 'src/books/books.module';
import { SlackbotModule } from 'src/slackbot/slackbot.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ReturningsController],
  providers: [ReturningsService],
  imports: [
    forwardRef(() => BooksModule),
    SlackbotModule,
    UsersModule,
    TypeOrmModule.forFeature([Returning, Book]),
    ReservationsModule,
  ],
  exports: [TypeOrmModule],
})
export class ReturningsModule {}
