import { Injectable } from '@nestjs/common';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { getConnection, JoinColumn } from 'typeorm';

@Injectable()
export class ReservationsService {
  findAll() {
    return `This action returns all reservations`;
  }

  findOne(id: number) {
    const connection = getConnection();
    const bookInfoRepository = connection.getRepository(User);
  }

  userJoinOne(id: number) {
    const connection = getConnection();
    const join = connection
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoin('user.reservations', 'Reservation')
      .where('user.intra = :intra', { intra: id })
      .getOne();
    if (join === undefined) {
      // 왜 안됌?
      console.log('해당 유저가 없습니다.');
    }
    return join;
  }

  bookJoinOne(id: number) {
    const connection = getConnection();
    const join = connection
      .getRepository(Book)
      .createQueryBuilder('book')
      .leftJoin('book.reservations', 'Reservation')
      .where('book.id = :bookId', { bookId: id })
      .getOne();
    if (join == null) {
      throw Error('해당 책이 없습니다.');
    }
    return join;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
