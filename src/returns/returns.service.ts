import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getConnection, getRepository, Repository } from 'typeorm';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { Returning } from './entities/return.entity';

@Injectable()
export class ReturnsService {
  constructor(
    @InjectRepository(Returning)
    private readonly returnsRepository: Repository<Returning>,
  ) {}

  async create(bookId: number) {
    return 'This action adds a new return';
  }

  async findAll() {
    return `This action returns all returns`;
  }

  async findOne(lendingId: number) {
    return `This action returns one returns`;
  }

  async update(id: number, updateReturnDto: UpdateReturnDto) {
    return `This action updates a #${id} return`;
  }

  async remove(id: number) {
    return `This action removes a #${id} return`;
  }
}
