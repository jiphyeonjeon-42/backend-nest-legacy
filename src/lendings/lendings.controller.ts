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
  async create(@Req() req, @Body() createLendingDto: CreateLendingDto) {
    const librarianId = req.user.id;
    return this.lendingsService.create(createLendingDto, librarianId);
  }
  @SerializeOptions({ groups: ['findAll'] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
    @Query('sort') sort = 'new',
  ): Promise<Pagination<Lending>> {
    return this.lendingsService.findAll({ page, limit }, sort);
  }

  @SerializeOptions({ groups: ['find'] })
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
