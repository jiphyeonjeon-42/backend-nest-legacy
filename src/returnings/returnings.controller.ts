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
import { ReturningsService } from './returnings.service';
import { CreateReturnDto } from './dto/create-returning.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('returnings')
export class ReturningsController {
  constructor(private readonly returningsService: ReturningsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req,
    @Body(new ValidationPipe()) createReturnDto: CreateReturnDto,
  ) {
    createReturnDto.librarianId = req.user.id;
    return this.returningsService.create(createReturnDto);
  }

  @Get()
  async findAll() {
    return this.returningsService.findAll();
  }

  @Get(':lendingId')
  async findOne(@Param('lendingId') lendingId: string) {
    return this.returningsService.findOne(+lendingId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.returningsService.remove(+id);
  }
}
