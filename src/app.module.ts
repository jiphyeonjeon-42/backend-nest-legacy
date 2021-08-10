import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LendingsModule } from './lendings/lendings.module';
import { ReturnsModule } from './returns/returns.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { ReservationsModule } from './reservations/reservations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from './users/entities/user.entity';
import { Returning } from './returns/entities/return.entity';
import { Lending } from './lendings/entities/lending.entity';
import { Book } from './books/entities/book.entity';
import { BookInfo } from './books/entities/bookInfo.entity';
import { Reservation } from './reservations/entities/reservation.entity';

@Module({
  imports: [
    LendingsModule,
    ReturnsModule,
    UsersModule,
    BooksModule,
    ReservationsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Returning, Lending, Book, BookInfo, Reservation],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
