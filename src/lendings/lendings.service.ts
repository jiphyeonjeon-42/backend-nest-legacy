import { Injectable } from '@nestjs/common';
import { UpdateLendingDto } from './dto/update-lending.dto';
import { getConnection } from 'typeorm';
import { Lending } from './entities/lending.entity';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LendingsService {
  async create() {
    return 'This action adds a new lending';
  }

  findAll() {
    const connection = getConnection();
    connection
      .getRepository(Lending)
      .find({ relations: ['book'] })
      .then((lendingData) => {});
    return `This action returns all lendings`;
  }

  findOne(lendingId: number) {
    const connection = getConnection();
    connection
      .getRepository(Lending)
      .findOne({ where: { id: lendingId }, relations: ['book'] })
      .then((bookData) => {});
    return `This action returns a #${lendingId} lending`;
  }

  update(id: number, updateLendingDto: UpdateLendingDto) {
    return `This action updates a #${id} lending`;
  }

  remove(id: number) {
    return `This action removes a #${id} lending`;
  }
}
