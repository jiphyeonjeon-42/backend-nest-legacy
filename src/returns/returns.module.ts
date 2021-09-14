import { Module } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { ReturnsController } from './returns.controller';
import { Returning } from './entities/return.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ReturnsController],
  providers: [ReturnsService],
  imports: [TypeOrmModule.forFeature([Returning])],
  exports: [TypeOrmModule],
})
export class ReturnsModule {}
