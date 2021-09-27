import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationRepository } from 'src/reservations/reservations.repository';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    @InjectRepository(Reservation)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  @Post()
  create() {
    return this.booksService.create();
  }

  @Get('/search')
  async search(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('query') query = '',
    @Query('sort') sort?: string,
    @Query('category') category?: string,
  ) {
    return this.booksService.search(query, page, limit, sort, category);
  }

  @SerializeOptions({ groups: ['search'] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/searchs')
  async searchBook(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @Query('query') query = '',
  ) {
    return this.booksService.searchBook(query, { page, limit });
  }

  @SerializeOptions({ groups: ['detail'] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('info/:id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Get('info/')
  async findInfo(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('sort') sort = 'new',
  ) {
    try {
      return this.booksService.findInfo({ page, limit }, sort);
    } catch (error) {
      return error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/reservations/count')
  async reservationWait(@Param('id') id: string) {
    const [list, count] = await this.reservationRepository.findAndCount({
      where: {
        book: { id: id },
      },
    });
    //console.log(list);
    return { count: count };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
