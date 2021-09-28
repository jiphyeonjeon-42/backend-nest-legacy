import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
  ValidationPipe,
  Body,
  BadRequestException,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReservationsService } from './reservations.service';
import { ReservationRepository } from './reservations.repository';
import { Reservation } from './entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UsersService } from 'src/users/users.service';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private userService: UsersService,
    @InjectRepository(Reservation)
    private readonly reservationRepository: ReservationRepository, // 1. DB와의 연결을 정의
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body(new ValidationPipe()) dto: CreateReservationDto,
  ) {
    const { id } = req.user;
    dto.userId = id;
    const findUser = await this.userService.findOne(id);
    //reservation count check
    const reservationCheck = await this.reservationsService.reservationCheck(
      dto,
    );
    if (reservationCheck) {
      throw new BadRequestException('예약하신 책입니다.');
    }
    if (findUser.reservationCnt >= 2) {
      throw new BadRequestException(
        '집현전의 도서는 2권까지 예약할 수 있습니다.',
      );
    }
    //create reservation
    await this.reservationsService.create(dto);
    const count = await this.reservationsService.findOne(dto.bookId);
    return { count: count };
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async search(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @Query('filters', new DefaultValuePipe([]), ParseArrayPipe)
    filters: string[] = [],
    @Query('word') word?: string,
  ) {
    try {
      return this.reservationsService.search({ page, limit }, word, filters);
    } catch (error) {
      return error;
    }
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
