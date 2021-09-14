import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchService } from 'src/search/search.service';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly searchService: SearchService,
  ) {}

  @Post()
  create() {
    return this.booksService.create();
  }

  @Get('/search')
  async search(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('query') query: string = '',
    @Query('sort') sort?: string,
    @Query('category') category?: string,
  ) {
    return this.booksService.search(query, page, limit, sort, category);
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
