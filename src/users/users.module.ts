import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UsersController],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserRepository, User]),
    HttpModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
