import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  getConnection,
  getRepository,
  QueryBuilder,
  Repository,
} from 'typeorm';
import { CreateReturnDto } from './dto/create-return.dto';
import { Returning } from './entities/return.entity';

@Injectable()
export class ReturnsService {
  constructor(
    @InjectRepository(Returning)
    private readonly returnsRepository: Repository<Returning>,
  ) {}

  async create(dto: CreateReturnDto) {
    const data = await this.returnsRepository
      .createQueryBuilder('returning')
      .insert()
      .into(Returning)
      .values({
        condition: dto.condition,
        lending: { id: dto.lendingId },
        user: { id: dto.userId },
        librarian: { id: dto.librarianId },
      })
      .execute();
  }

  async findAll() {
    return `This action returns all returns`;
  }

  async findOne(lendingId: number) {
    return `This action returns one returns`;
  }

  async remove(id: number) {
    return `This action removes a #${id} return`;
  }
}
