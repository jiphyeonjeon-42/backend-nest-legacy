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
import { CreateReservationDto } from './dto/create-reservation.dto';
import { SlackbotService } from 'src/slackbot/slackbot.service';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly slackbotService: SlackbotService,
    private readonly userService: UsersService,
    private readonly booksService: BooksService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body(new ValidationPipe()) dto: CreateReservationDto,
  ) {
    const { id } = req.user;
    dto.userId = id;
    //reservation count check
    const reservationBookCheck =
      await this.reservationsService.reservationBookCheck(dto);
    if (reservationBookCheck) {
      throw new BadRequestException('예약하신 책입니다.');
    }
    const userCount = await this.reservationsService.findOneCnt(
      dto.userId,
      'user',
    );
    if (userCount >= 2) {
      throw new BadRequestException(
        '집현전의 도서는 2권까지 예약할 수 있습니다.',
      );
    }

    //create reservation
    await this.reservationsService.create(dto);

    //slack message send.
    const findUser = await this.userService.findOne(dto.userId);
    const { title } = await this.booksService.findOne(dto.bookId);
    const message =
      '📖' +
      ' 예약 알리미 ' +
      '📖\n' +
      '`' +
      title +
      '`' +
      '이 예약되었습니다.';
    this.slackbotService.publishMessage(findUser.slack, message);
    const bookCount = await this.reservationsService.findOneCnt(
      dto.bookId,
      'book',
    );
    return { count: bookCount };
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }
}
