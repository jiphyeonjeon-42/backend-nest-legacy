import { Module } from '@nestjs/common';
import { LendingsService } from './lendings.service';
import { LendingsController } from './lendings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lending } from './entities/lending.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [LendingsController],
  providers: [LendingsService],
  imports: [TypeOrmModule.forFeature([Lending, User])],
  exports: [TypeOrmModule],
})
export class LendingsModule {}
