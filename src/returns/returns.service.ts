import { Injectable } from '@nestjs/common';
import { Lending } from 'src/lendings/entities/lending.entity';
import { getConnection, getRepository } from 'typeorm';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { Returning } from './entities/return.entity';

@Injectable()
export class ReturnsService {
  create(createReturnDto: CreateReturnDto) {
    const connection = getConnection();
    const returnRepository = getRepository(Returning);
    const lendingRepository = getRepository(Lending);
    returnRepository.insert({
      condition: '양호',
    });
    return 'This action adds a new return';
  }

  findAll() {
    return `This action returns all returns`;
  }

  findOne(bookId: number, cadetId: number) {
    // TODO : lending테이블에서 해당되는 엔티티 가져오기
    const connection = getConnection();
    const lendingRepository = connection.getRepository(Lending);
    lendingRepository
      .createQueryBuilder()
      .where('bookId:bookId AND userId:cadetId');
  }

  update(id: number, updateReturnDto: UpdateReturnDto) {
    return `This action updates a #${id} return`;
  }

  remove(id: number) {
    return `This action removes a #${id} return`;
  }
}
