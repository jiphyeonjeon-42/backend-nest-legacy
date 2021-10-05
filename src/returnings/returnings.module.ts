import { Module } from '@nestjs/common';
import { ReturningsService } from './returnings.service';
import { ReturningsController } from './returnings.controller';
import { Returning } from './entities/returning.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ReturningsController],
  providers: [ReturningsService],
  imports: [TypeOrmModule.forFeature([Returning])],
  exports: [TypeOrmModule],
})
export class ReturningsModule {}
