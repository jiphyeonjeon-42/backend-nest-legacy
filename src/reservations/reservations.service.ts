import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/user.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { ReservationRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: ReservationRepository, // 1. DB와의 연결을 정의
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateReservationDto) {
    await this.reservationRepository
      .createQueryBuilder('reservation')
      .insert()
      .into(Reservation)
      .values([{ user: { id: dto.userId }, book: { id: dto.bookId } }])
      .execute();
  }

  async update(userid: number) {
    await this.userRepository
      .createQueryBuilder('user')
      .update()
      .set({
        reservationCnt: () => 'reservationCnt + 1',
      })
      .where('id = :id', { id: userid })
      .execute();
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
