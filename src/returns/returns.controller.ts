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
  async create(@Query('bookId') bookId: string) {
    return this.returnsService.create(+bookId);
  }

  @Get()
  async findAll() {
    return this.returnsService.findAll();
  }

  @Get(':lendingId')
  async findOne(@Param('lendingId') lendingId: string) {
    return this.returnsService.findOne(+lendingId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReturnDto: UpdateReturnDto,
  ) {
    return this.returnsService.update(+id, updateReturnDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.returnsService.remove(+id);
  }
}
