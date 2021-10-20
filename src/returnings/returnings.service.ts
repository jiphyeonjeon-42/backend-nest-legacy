import { Injectable, BadRequestException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { BooksService } from 'src/books/books.service';
import { Lending } from 'src/lendings/entities/lending.entity';
import { ReservationsService } from 'src/reservations/reservations.service';
import { SlackbotService } from 'src/slackbot/slackbot.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
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
    private readonly slackbotService: SlackbotService,
    private readonly userService: UsersService,
    private readonly booksService: BooksService,
  ) {}

  async create(dto: CreateReturnDto) {
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
    const LendingData = await lendingsRepository.findOne({
      relations: ['book'],
      where: returningData.lending,
    });
    const bookId = LendingData.book.id;

    const reservationData = await this.reservationsService.getReservation(
      bookId,
    );
    if (reservationData != undefined) {
      await this.reservationsService.setEndAt(reservationData.id);
      const findUser = await this.userService.findOne(reservationData.user.id);
      const { title } = await this.booksService.findOne(bookId);
      const message =
        '📖 예약 알리미 📖\n' +
        '`' +
        title +
        '`' +
        '이 반납되었습니다. 3일 이내에 책을 대출해 주세요.';
      this.slackbotService.publishMessage(findUser.slack, message);
    }
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
