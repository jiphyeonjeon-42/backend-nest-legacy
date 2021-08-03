import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LendingsModule } from './lendings/lendings.module';
import { ReturnsModule } from './returns/returns.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [
    LendingsModule,
    ReturnsModule,
    UsersModule,
    BooksModule,
    ReservationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
