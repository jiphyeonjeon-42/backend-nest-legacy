import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { getConnection } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  static isReservation() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: ReservationRepository, // 1. DB와의 연결을 정의
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async create(dto: CreateReservationDto) {
    const reservation = new Reservation({
      book: new Book({ id: dto.bookId }),
      user: new User({ id: dto.userId }),
    });
    try {
      await getConnection().transaction(async (manager) => {
        await manager.save(reservation);
        await manager.update(User, dto.userId, {
          reservationCnt: () => 'reservationCnt + 1',
        });
      });
    } catch (err) {
      throw new BadRequestException(err.sqlMessage);
    }
  }

  async findOne(bookId: number) {
    const [list, count] = await this.reservationRepository.findAndCount({
      where: {
        book: { id: bookId },
      },
    });
    return count;
  }

  async reservationCheck(dto: CreateReservationDto) {
    const check = await this.reservationRepository.findOne({
      where: { user: dto.userId, book: dto.bookId },
    });
    return check;
  }

  async search(options: IPaginationOptions, word: string, filters: string[]) {
    let queryBuilder =
      this.reservationRepository.createQueryBuilder('reservation');
    if (!filters.includes('proceeding') && !filters.includes('finish')) {
      // 둘다 선택안했을 때
      queryBuilder = queryBuilder.where('id IS NULL'); //다시 확인
    } else if (filters.includes('proceeding') && !filters.includes('finish')) {
      // proceeding
      queryBuilder = queryBuilder
        .where('reservation.endAt > :current_date', {
          current_date: new Date(),
        })
        .orWhere('reservation.endAt IS NULL')
        .andWhere('reservation.canceledAt IS NULL');
    } else if (filters.includes('finish') && !filters.includes('proceeding')) {
      // finish
      queryBuilder = queryBuilder
        .where('reservation.canceledAt IS NOT NULL')
        .orWhere('reservation.endAt <= :current_date', {
          current_date: new Date(),
        });
    }
    return paginate(queryBuilder, options);
  }

  findAll() {
    return `This action returns all reservations`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
