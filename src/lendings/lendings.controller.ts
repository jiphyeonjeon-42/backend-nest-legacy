import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  DefaultValuePipe,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LendingsService } from './lendings.service';
import { UpdateLendingDto } from './dto/update-lending.dto';
import { Lending } from './entities/lending.entity';
import { CreateLendingDto } from './dto/create-lending.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('lendings')
export class LendingsController {
  constructor(private readonly lendingsService: LendingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body(new ValidationPipe()) createLendingDtos: CreateLendingDto[],
  ) {
    const librarianId = req.user.id;
    for (const dto of createLendingDtos)
      await this.lendingsService.create(dto, librarianId);
  }

  @SerializeOptions({ groups: ['lendings.search'] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/search')
  async search(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @Query('sort') sort = 'new',
    @Query('query') query = '',
  ): Promise<Pagination<Lending>> {
    return this.lendingsService.search({ page, limit }, sort, query);
  }

  @SerializeOptions({ groups: ['lendings.findOne'] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.lendingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLendingDto: UpdateLendingDto) {
    return this.lendingsService.update(+id, updateLendingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lendingsService.remove(+id);
  }
}
