import { Module } from '@nestjs/common';
import { LendingsService } from './lendings.service';
import { LendingsController } from './lendings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lending } from './entities/lending.entity';
import { UsersModule } from 'src/users/users.module';
import { BooksModule } from 'src/books/books.module';
import { SlackbotModule } from 'src/slackbot/slackbot.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [LendingsController],
  providers: [LendingsService],
  imports: [
    UsersModule,
    BooksModule,
    SlackbotModule,
    TypeOrmModule.forFeature([Lending, User]),
  ],
  exports: [TypeOrmModule],
})
export class LendingsModule {}
