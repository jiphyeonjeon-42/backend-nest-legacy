import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateLendingDto } from './dto/update-lending.dto';
import { Connection, IsNull, Repository } from 'typeorm';
import { Lending } from './entities/lending.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateLendingDto } from './dto/create-lending.dto';
import { SlackbotService } from 'src/slackbot/slackbot.service';
import { UsersService } from 'src/users/users.service';
import { BooksService } from 'src/books/books.service';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ReservationsService } from 'src/reservations/reservations.service';
import { CreateReservationDto } from 'src/reservations/dto/create-reservation.dto';

async function checkUser(
  lenidngsRepository: Repository<Lending>,
  usersRepository: Repository<User>,
  userId: number,
) {
  const userData = await usersRepository.findOne(userId);
  if (userData == undefined) return 0;
  const today: Date = new Date();
  const penalty: Date = new Date(userData['penaltyAt']);
  const lendingCnt = await lenidngsRepository
    .createQueryBuilder('lending')
    .select()
    .leftJoinAndSelect('lending.returning', 'returning')
    .innerJoinAndSelect('lending.user', 'user')
    .where('returning.id is null')
    .andWhere('user.id=:userId', { userId: userId })
    .getCount();
  console.log(lendingCnt);
  if (2 <= lendingCnt || today <= penalty) return 0;
  return 1;
}

// async function checkLibrarian(
//   usersRepository: Repository<User>,
//   librarianId: number,
// ) {
//   const librarian = await usersRepository.findOne(librarianId);
//   if (librarian == undefined) return 0;
//   if (!librarian['librarian']) return 0;
//   return 1;
// }

@Injectable()
export class LendingsService {
  constructor(
    @InjectRepository(Lending)
    private readonly lendingsRepository: Repository<Lending>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private reservationsService: ReservationsService,
    private connection: Connection,
    private readonly slackbotService: SlackbotService,
    private readonly userService: UsersService,
    private readonly booksService: BooksService,
  ) {}

  async create(dto: CreateLendingDto, librarianId: number) {
    if (
      !(await checkUser(
        this.lendingsRepository,
        this.usersRepository,
        dto.userId,
      ))
      // || !(await checkLibrarian(this.usersRepository, librarianId))
    )
      throw new BadRequestException({
        errorCode: 2,
        message: ['?????? ?????? ??? ?????? ???????????????.'],
      });

    const reservationData = await this.reservationsService.getReservation(
      dto.bookId,
    );
    if (reservationData != undefined && reservationData.user.id != dto.userId)
      throw new BadRequestException({
        errorCode: 3,
        message: ['????????? ????????????.'],
      });
    const lendingData = await this.getLending(dto.bookId);
    if (lendingData != undefined && !lendingData.returning)
      throw new BadRequestException({
        errorCode: 4,
        message: ['?????? ????????? ????????????.'],
      });
    try {
      await this.lendingsRepository.insert({
        condition: dto.condition,
        user: { id: dto.userId },
        librarian: { id: librarianId },
        book: { id: dto.bookId },
      });
      const findUser = await this.userService.findOne(dto.userId);
      const { title } = await this.booksService.findInfoByBookId(dto.bookId);
      const now = new Date();
      const limitDay = new Date(
        now.setDate(now.getDate() + 14),
      ).toLocaleDateString();
      const message =
        '???? ?????? ????????? ????\n' +
        '?????? ?????? ' +
        '`' +
        title +
        '`' +
        '???(???) ' +
        limitDay +
        '?????? ??????????????????.';
      this.slackbotService.publishMessage(findUser.slack, message);
    } catch (e) {
      throw new BadRequestException({
        errorCode: 5,
        message: ['db ??????'],
      });
    }

    if (reservationData != undefined)
      await this.reservationsService.fetchEndAt(reservationData.id);
  }

  async search(
    options: IPaginationOptions,
    sort: string,
    query?: string,
  ): Promise<Pagination<Lending>> {
    let standard = false;
    if (sort != 'new') standard = true;
    let lendingData = this.lendingsRepository
      .createQueryBuilder('lending')
      .leftJoinAndSelect('lending.user', 'user')
      .leftJoinAndSelect('lending.book', 'book')
      .leftJoinAndSelect('book.info', 'info')
      .leftJoinAndSelect('lending.returning', 'returning')
      .where('returning.id is null');
    if (Object.keys(query).length != 0) {
      lendingData = lendingData
        .where('returning.id is null')
        .andWhere(
          '(info.title like :word or user.login like :word or book.callSign like :word)',
          {
            word: `%${query}%`,
          },
        );
    }
    if (standard) lendingData = lendingData.orderBy('lending.createdAt', 'ASC');
    else lendingData = lendingData.orderBy('lending.createdAt', 'DESC');
    return paginate<Lending>(lendingData, options);
  }

  async findOne(lendingId: number) {
    const lendingData = await this.lendingsRepository.findOne({
      relations: ['user', 'librarian', 'book', 'returning', 'book.info'],
      where: { id: lendingId },
    });
    if (lendingData == undefined || lendingData['returning'])
      throw new NotFoundException();
    return lendingData;
  }

  async isLentBook(bookId: number) {
    const findBook = await this.lendingsRepository.find({
      relations: ['returning'],
      where: { book: { id: bookId }, returning: { id: IsNull() } },
    });
    return findBook.length != 0;
  }

  async isLentUser(dto: CreateReservationDto) {
    const lending = await this.lendingsRepository.find({
      relations: ['returning', 'user'],
      where: {
        book: { id: dto.bookId },
        returning: { id: IsNull() },
      },
    });
    if (lending[0].user.id === dto.userId) return 1;
    return 0;
  }

  async getLending(bookId: number): Promise<Lending> | undefined {
    const lendingData = await this.lendingsRepository
      .createQueryBuilder('lending')
      .leftJoinAndSelect('lending.book', 'book')
      .leftJoinAndSelect('lending.returning', 'returning')
      .where('book.id=:bookId', { bookId: bookId })
      .orderBy('lending.createdAt', 'DESC')
      .getOne();
    return lendingData;
  }

  update(id: number, updateLendingDto: UpdateLendingDto) {
    return `This action updates a #${id} lending`;
  }

  remove(id: number) {
    return `This action removes a #${id} lending`;
  }
}
