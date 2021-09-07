import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lending } from 'src/lendings/entities/lending.entity';
import { User } from 'src/users/entities/user.entity';
import { Connection, ConnectionOptionsReader, getConnection, getRepository, Repository } from 'typeorm';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
import { Returning } from './entities/return.entity';

@Injectable()
export class ReturnsService {
  constructor(
    @InjectRepository(Returning)
    private readonly returnsRepository: Repository<Returning>,
  ) {}

  async create(bookId:number) {
    const connection = getConnection();
    const usersRepository = getRepository(User);
    const lendingsRepository = getRepository(Lending);
    await usersRepository.findOne().then((userData) => {
      lendingsRepository
        .findOne(1, { relations: ['returning']})
        .then((lendingData) => {
          this.returnsRepository
            .insert({
              condition: '양호',
              lending: lendingData,
              user: userData,
            })
            .then((data) => {
              connection
                .createQueryBuilder()
                .update(Lending)
                .set({
                  returning: data.identifiers[0].id,
                })
                .where('id = :id', { id: lendingData.id })
                .execute();
            });
        });
    });
    return 'This action adds a new return';
  }

  async findAll() {
    return `This action returns all returns`;
  }

  // TODO
  async findOne(lendingId:number) {
    return await this.returnsRepository.createQueryBuilder('Returning')
    .innerJoinAndSelect('Returning.lending', 'lending')
    .where('lending.id=:lendingId', {lendingId:lendingId})
    .getOne();
  }

  async update(id: number, updateReturnDto: UpdateReturnDto) {
    return `This action updates a #${id} return`;
  }

  async remove(id: number) {
    return `This action removes a #${id} return`;
  }
}
