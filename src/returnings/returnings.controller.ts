import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReturningsService } from './returnings.service';
import { CreateReturnDto } from './dto/create-returning.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CodeValidationPipe } from 'src/code-validation.pipe';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('returnings')
export class ReturningsController {
  constructor(private readonly returningsService: ReturningsService) {}

  @Post()
  async create(
    @Req() req,
    @Body(new CodeValidationPipe()) createReturnDto: CreateReturnDto,
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
