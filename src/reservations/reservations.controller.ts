import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
  Body,
  BadRequestException,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
  ParseArrayPipe,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { SlackbotService } from 'src/slackbot/slackbot.service';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';
import { LendingsService } from 'src/lendings/lendings.service';
import { CodeValidationPipe } from 'src/code-validation.pipe';
import { Lending } from 'src/lendings/entities/lending.entity';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly slackbotService: SlackbotService,
    private readonly userService: UsersService,
    private readonly booksService: BooksService,
    private readonly lendingsService: LendingsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body(new CodeValidationPipe()) dto: CreateReservationDto,
  ) {
    const { id } = req.user;
    dto.userId = id;

    //lending book check
    const lendingBookCheck = await this.lendingsService.isLentBook(dto.bookId);
    if (!lendingBookCheck) {
      throw new BadRequestException({
        errorCode: 2,
        message: ['대출 되지 않은 책입니다.'],
      });
    }

    //lending user check
    const lendingUserCheck = await this.lendingsService.isLentUser(dto);
    if (lendingUserCheck) {
      throw new BadRequestException({
        errorCode: 6,
        message: ['본인이 대출한 책은 다시 예약할 수 없습니다.'],
      });
    }

    //reservation count check
    const reservationBookCheck =
      await this.reservationsService.reservationBookCheck(dto);
    if (reservationBookCheck) {
      throw new BadRequestException({
        errorCode: 3,
        message: ['이미 예약된 책입니다.'],
      });
    }
    const userCount = await this.reservationsService.userCnt(dto.userId);
    if (userCount >= 2) {
      throw new BadRequestException({
        errorCode: 4,
        message: ['예약한 책이 2권 초과되었습니다.'],
      });
    }

    //create reservation
    await this.reservationsService.create(dto);

    //slack message send.
    const findUser = await this.userService.findOne(dto.userId);
    const { title } = await this.booksService.findOne(dto.bookId);
    const message =
      '📖 예약 알리미 📖\n' + '`' + title + '`' + '이 예약되었습니다.';
    const bookCount = await this.reservationsService.bookCnt(dto.bookId);
    this.slackbotService.publishMessage(findUser.slack, message);
    let lenderableInfo: Lending;
    if (bookCount === 1) {
      lenderableInfo = await this.lendingsService.getLending(dto.bookId);
      const date = new Date(lenderableInfo.createdAt);
      date.setDate(date.getDate() + 14);
      return {
        count: bookCount,
        lenderableDate: date.toLocaleString('ko', { timeZone: 'Asia/Seoul' }),
      };
    } else return { count: bookCount, lenderableDate: null };
  }

  @UseGuards(JwtAuthGuard)
  @SerializeOptions({ groups: ['reservations.search'] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('search')
  async search(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @Query('filter', new DefaultValuePipe([]), ParseArrayPipe)
    filter: string[] = [],
    @Query('query') query = '',
  ) {
    try {
      return this.reservationsService.search({ page, limit }, query, filter);
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
