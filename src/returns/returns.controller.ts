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
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';

@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  create(@Body() createReturnDto: CreateReturnDto) {
    return this.returnsService.create(createReturnDto);
  }

  @Get()
  findAll() {
    return this.returnsService.findAll();
  }

  @Get()
  findOne(@Query('bookId') bookId: string, @Query('cadetId') cadetId: string) {
    return this.returnsService.findOne(+bookId, +cadetId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReturnDto: UpdateReturnDto) {
    return this.returnsService.update(+id, updateReturnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.returnsService.remove(+id);
  }
}
