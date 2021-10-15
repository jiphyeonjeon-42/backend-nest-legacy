import { Injectable, BadRequestException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Lending } from 'src/lendings/entities/lending.entity';
import { ReservationsService } from 'src/reservations/reservations.service';
import { User } from 'src/users/entities/user.entity';
import {
  Connection,
  getConnection,
  getRepository,
  QueryBuilder,
  Repository,
} from 'typeorm';
import { CreateReturnDto } from './dto/create-returning.dto';
import { Returning } from './entities/returning.entity';

@Injectable()
export class ReturningsService {
  constructor(
    @InjectRepository(Returning)
    private readonly returningsRepository: Repository<Returning>,
    private connection: Connection,
    private schedulerRegistry: SchedulerRegistry,
    private reservationsService: ReservationsService,
  ) {}

  async create(dto: CreateReturnDto) {
    let LendingData: Lending;
    let returningData: Returning;
    const returning = new Returning({
      condition: dto.condition,
      lending: new Lending({ id: dto.lendingId }),
      user: new User({ id: dto.userId }),
      librarian: new User({ id: dto.librarianId }),
    });
    try {
      await getConnection().transaction(async (manager) => {
        returningData = await manager.recover(returning);
      });
    } catch (err) {
      throw new BadRequestException(err.sqlMessage);
    }
    const lendingsRepository = this.connection.getRepository(Lending);
    LendingData = await lendingsRepository.findOne({
      relations: ['book'],
      where: returningData.lending,
    });
    const bookId = LendingData.book.id;

    const reservationData = await this.reservationsService.getReservation(
      bookId,
    );
    if (reservationData != undefined)
      await this.reservationsService.setEndAt(reservationData.id);
  }

  async findAll() {
    return `This action returnings all returnings`;
  }

  async findOne(lendingId: number) {
    return `This action returnings one returnings`;
  }

  async remove(id: number) {
    return `This action removes a #${id} return`;
  }
}
