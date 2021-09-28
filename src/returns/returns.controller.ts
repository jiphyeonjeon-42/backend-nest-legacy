import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dto/create-return.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body(new ValidationPipe()) createReturnDto: CreateReturnDto,
  ) {
    createReturnDto.librarianId = req.user.id;
    return this.returnsService.create(createReturnDto);
  }

  @Get()
  async findAll() {
    return this.returnsService.findAll();
  }

  @Get(':lendingId')
  async findOne(@Param('lendingId') lendingId: string) {
    return this.returnsService.findOne(+lendingId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.returnsService.remove(+id);
  }
}
