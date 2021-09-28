import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LendingsService } from './lendings.service';
import { UpdateLendingDto } from './dto/update-lending.dto';

@Controller('lendings')
export class LendingsController {
  constructor(private readonly lendingsService: LendingsService) {}

  @Post()
  create(@Query('bookId') bookId: string, @Query('userId') userId: string) {
    return this.lendingsService.create(+bookId, +userId);
  }

  @Get()
  findAll() {
    return this.lendingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
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
