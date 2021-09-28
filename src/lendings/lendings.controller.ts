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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LendingsService } from './lendings.service';
import { UpdateLendingDto } from './dto/update-lending.dto';
import { Lending } from './entities/lending.entity';
import { CreateLendingDto } from './dto/create-lending.dto';

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
  async findAll() {
    return this.lendingsService.findAll();
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
