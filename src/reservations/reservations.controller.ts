import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { createQueryBuilder } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get() //Post로 바꿔야함
  async create(@Req() req) {
    const { id } = req.user;
    const user = await this.reservationsService.userJoinOne(id);
    const book = await this.reservationsService.bookJoinOne(id);
    console.log(user);
    return 'reservations 생성 함수';
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }
}
