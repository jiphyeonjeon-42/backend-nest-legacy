import {
  BadRequestException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateLendingDto } from './dto/update-lending.dto';
import { Connection, getConnection, getManager, Repository } from 'typeorm';
import { Lending } from './entities/lending.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateLendingDto } from './dto/create-lending.dto';

async function checkLendingCnt(userId: number) {
  const userData = await getConnection().getRepository('User').findOne(userId);
  if (userData == undefined) return 0;
  const today: Date = new Date();
  const penalty: Date = new Date(userData['penaltiyAt']);
  if (2 <= userData['lendingCnt'] || today <= penalty) return 0;
  return 1;
}

async function checkLibrarian(librarianId: number) {
  const librarian = await getConnection()
    .getRepository('User')
    .findOne(librarianId);
  if (librarian == undefined) return 0;
  if (!librarian['librarian']) return 0;
  return 1;
}

@Injectable()
export class LendingsService {
  constructor(
    @InjectRepository(Lending)
    private readonly lendingsRepository: Repository<Lending>,
    private connection: Connection,
  ) {}

  async create(dto: CreateLendingDto, librarianId: number) {
    if (
      !(await checkLendingCnt(dto.userId)) ||
      !(await checkLibrarian(librarianId))
    )
      throw new BadRequestException(dto.userId || librarianId);
    try {
      await this.connection.transaction(async (manager) => {
        await manager.insert(Lending, {
          condition: dto.condition,
          user: { id: dto.userId },
          librarian: { id: librarianId },
          book: { id: dto.bookId },
        });
        await manager.update(User, dto.userId, {
          lendingCnt: () => 'lendingCnt + 1',
        });
      });
    } catch (e) {
      throw new Error("lendings.service.create() catch'");
    }
    return 'This action adds a new lending';
  }

  async findAll() {
    return await this.lendingsRepository.find({
      relations: ['user', 'librarian', 'book', 'returning', 'book.info'],
      where: { returning: null },
    });
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

  update(id: number, updateLendingDto: UpdateLendingDto) {
    return `This action updates a #${id} lending`;
  }

  remove(id: number) {
    return `This action removes a #${id} lending`;
  }
}
