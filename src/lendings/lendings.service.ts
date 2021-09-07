import { Injectable } from '@nestjs/common';
import { UpdateLendingDto } from './dto/update-lending.dto';
import { Repository } from 'typeorm';
import { Lending } from './entities/lending.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LendingsService {
  constructor(
    @InjectRepository(Lending)
    private readonly lendingsRepository: Repository<Lending>,
  ) {}

  async create(bookId: number, userId: number) {
    return 'This action adds a new lending';
  }

  findAll() {
    return `This action returns all lendings`;
  }

  findOne(lendingId: number) {
    return `This action returns a #${lendingId} lending`;
  }

  update(id: number, updateLendingDto: UpdateLendingDto) {
    return `This action updates a #${id} lending`;
  }

  remove(id: number) {
    return `This action removes a #${id} lending`;
  }
}
