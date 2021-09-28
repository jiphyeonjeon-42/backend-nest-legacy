import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lending } from 'src/lendings/entities/lending.entity';
import { User } from 'src/users/entities/user.entity';
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
    private connection: Connection,
  ) {}

  async create(dto: CreateReturnDto) {
    const returning = new Returning({
      condition: dto.condition,
      lending: new Lending({ id: dto.lendingId }),
      user: new User({ id: dto.userId }),
      librarian: new User({ id: dto.librarianId }),
    });
    try {
      await getConnection().transaction(async (manager) => {
        await manager.save(returning);
        await manager.update(User, dto.userId, {
          lendingCnt: () => 'lendingCnt - 1',
        });
      });
    } catch (err) {
      throw new BadRequestException(err.sqlMessage);
    }
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
