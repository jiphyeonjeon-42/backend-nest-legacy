import { Injectable } from '@nestjs/common';
import { UpdateLendingDto } from './dto/update-lending.dto';
import { getConnection, Repository } from 'typeorm';
import { Lending } from './entities/lending.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LendingsService {
  constructor(
    @InjectRepository(Lending)
    private readonly lendingsRepository: Repository<Lending>,
  ) {}
  // TODO : book.status 변환
  async create(bookId: number, userId: number) {
    const connection = getConnection();
    const booksRepository = connection.getRepository(Book);
    const usersRepository = connection.getRepository(User);
    booksRepository
      .createQueryBuilder('Book')
      .where('book.id=:bookId', {bookId:bookId})
      .getOne()
      .then((bookData) => {
        usersRepository.findOne({where:{id:userId}})
        .then((userData) => {
          this.lendingsRepository.insert({
            book: bookData,
            condition: '양호',
            user: userData,
          });
        }, error => {
          console.error(error.message)
        });
        return bookData;
      });
    return 'This action adds a new lending';
  }

  findAll() {
    return this.lendingsRepository.find({ relations: ['book', 'returning'] });
    // return `This action returns all lendings`;
  }

  findOne(lendingId: number) {
    this.lendingsRepository
      .findOne({ where: { id: lendingId }, relations: ['book'] })
      .then((bookData) => {});
    return `This action returns a #${lendingId} lending`;
  }

  update(id: number, updateLendingDto: UpdateLendingDto) {
    return `This action updates a #${id} lending`;
  }

  remove(id: number) {
    return `This action removes a #${id} lending`;
  }
}
