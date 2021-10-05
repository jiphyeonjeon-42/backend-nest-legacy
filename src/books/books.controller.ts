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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReservationsService } from 'src/reservations/reservations.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly reservationsService: ReservationsService,
  ) {}

  @Post()
  create() {
    return this.booksService.create();
  }

  @Get('/info/search')
  async search(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('query') query = '',
    @Query('sort') sort?: string,
    @Query('category') category?: string,
  ) {
    return this.booksService.search(query, page, limit, sort, category);
  }

  @SerializeOptions({ groups: ['books.searchBook'] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/search')
  async searchBook(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @Query('query') query = '',
  ) {
    return this.booksService.searchBook(query, { page, limit });
  }

  @SerializeOptions({ groups: ['books.findOne'] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('info/:id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @SerializeOptions({ groups: ['books.findInfo'] })
  @UseInterceptors(ClassSerializerInterceptor)
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
    const count = this.reservationsService.bookCnt(parseInt(id));
    return { count: count };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
