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
      throw new BadRequestException('dto.userId || librarianId Error');

    const reservationData = await this.reservationsService.getReservation(
      dto.bookId,
    );
    if (reservationData != undefined && reservationData.user.id != dto.userId)
      throw new BadRequestException('예약된 책입니다.');
    try {
      await this.lendingsRepository.insert({
        condition: dto.condition,
        user: { id: dto.userId },
        librarian: { id: librarianId },
        book: { id: dto.bookId },
      });
      const findUser = await this.userService.findOne(dto.userId);
      const { title } = await this.booksService.findOne(dto.bookId);
      const now = new Date();
      const limitDay = new Date(
        now.setDate(now.getDate() + 14),
      ).toLocaleDateString();
      const message =
        '📔 대출 알리미 📔\n' +
        '대출 하신 ' +
        '`' +
        title +
        '`' +
        '은(는) ' +
        limitDay +
        '까지 반납해주세요.';
      this.slackbotService.publishMessage(findUser.slack, message);
    } catch (e) {
      throw new Error("lendings.service.create() catch'");
    }

    if (reservationData != undefined)
      await this.reservationsService.fetchEndAt(reservationData.id);

    return 'This action adds a new lending';
  }

  async findAll(
    options: IPaginationOptions,
    sort: string,
    query?: string,
  ): Promise<Pagination<Lending>> {
    if (!(sort === 'new' || sort === 'older'))
      throw new BadRequestException('sort string Error');
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
            word: `%${query['word']}%`,
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

  update(id: number, updateLendingDto: UpdateLendingDto) {
    return `This action updates a #${id} lending`;
  }

  remove(id: number) {
    return `This action removes a #${id} lending`;
  }
}
