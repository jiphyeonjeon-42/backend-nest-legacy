import { Module } from '@nestjs/common';
import { LendingsService } from './lendings.service';
import { LendingsController } from './lendings.controller';

@Module({
  controllers: [LendingsController],
  providers: [LendingsService],
})
export class LendingsModule {}
