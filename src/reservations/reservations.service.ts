import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { getConnection, MoreThanOrEqual } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  static isReservation() {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly reservationsRepository: ReservationRepository, // 1. DB와의 연결을 정의
  ) {}

  async create(dto: CreateReservationDto) {
    const reservation = new Reservation({
      book: new Book({ id: dto.bookId }),
      user: new User({ id: dto.userId }),
    });
    try {
      await getConnection().transaction(async (manager) => {
        await manager.save(reservation);
      });
    } catch (err) {
      throw new BadRequestException(err.sqlMessage);
    }
  }

  async bookCnt(itemId: number) {
    const [list, count] = await this.reservationsRepository.findAndCount({
      where: [
        {
          book: { id: itemId },
          endAt: MoreThanOrEqual(new Date()),
          canceledAt: null,
        },
        {
          book: { id: itemId },
          endAt: null,
          canceledAt: null,
        },
      ],
    });
    return count;
  }

  async userCnt(itemId: number) {
    const [list, count] = await this.reservationsRepository.findAndCount({
      where: [
        {
          user: { id: itemId },
          endAt: MoreThanOrEqual(new Date()),
          canceledAt: null,
        },
        {
          user: { id: itemId },
          endAt: null,
          canceledAt: null,
        },
      ],
    });
    return count;
  }

  async reservationBookCheck(dto: CreateReservationDto) {
    const [list, count] = await this.reservationsRepository.findAndCount({
      where: [
        {
          user: { id: dto.userId },
          book: { id: dto.bookId },
          endAt: MoreThanOrEqual(new Date()),
          canceledAt: null,
        },
        {
          user: { id: dto.userId },
          book: { id: dto.bookId },
          endAt: null,
          canceledAt: null,
        },
      ],
    });
    return count;
  }

  async search(options: IPaginationOptions, query: string, filters: string[]) {
    let queryBuilder = this.reservationsRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.book', 'book')
      .leftJoinAndSelect('book.info', 'info')
      .leftJoinAndSelect('book.lendings', 'lendings');
    if (!filters.includes('proceeding') && !filters.includes('finish')) {
      // 둘다 선택안했을 때
      queryBuilder = queryBuilder.where('id IS NULL'); //다시 확인
    } else if (filters.includes('proceeding') && !filters.includes('finish')) {
      // proceeding
      queryBuilder = queryBuilder
        .where('reservation.endAt >= :current_date', {
          current_date: new Date(),
        })
        .orWhere('reservation.endAt IS NULL')
        .andWhere('reservation.canceledAt IS NULL');
    } else if (filters.includes('finish') && !filters.includes('proceeding')) {
      // finish
      queryBuilder = queryBuilder
        .where('reservation.canceledAt IS NOT NULL')
        .orWhere('reservation.endAt < :current_date', {
          current_date: new Date(),
        });
    }
    queryBuilder = queryBuilder.where(
      '(user.login like :query or info.title like :query)',
      {
        query: `%${query}%`,
      },
    );
    return paginate(queryBuilder, options);
  }

  findAll() {
    return `This action returnings all reservations`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
