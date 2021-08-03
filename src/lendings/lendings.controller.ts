import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LendingsService } from './lendings.service';
import { CreateLendingDto } from './dto/create-lending.dto';
import { UpdateLendingDto } from './dto/update-lending.dto';

@Controller('lendings')
export class LendingsController {
  constructor(private readonly lendingsService: LendingsService) {}

  @Post()
  create(@Body() createLendingDto: CreateLendingDto) {
    return this.lendingsService.create(createLendingDto);
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
