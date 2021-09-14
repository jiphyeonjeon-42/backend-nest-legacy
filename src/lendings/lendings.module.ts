import { Module } from '@nestjs/common';
import { LendingsService } from './lendings.service';
import { LendingsController } from './lendings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lending } from './entities/lending.entity';

@Module({
  controllers: [LendingsController],
  providers: [LendingsService],
  imports: [TypeOrmModule.forFeature([Lending])],
  exports: [TypeOrmModule],
})
export class LendingsModule {}
