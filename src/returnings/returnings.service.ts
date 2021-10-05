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
  ) {}

  async create(dto: CreateReturnDto) {
    const returning = new Returning({
      condition: dto.condition,
      lending: new Lending({ id: dto.lendingId }),
      user: new User({ id: dto.userId }),
      librarian: new User({ id: dto.librarianId }),
    });
    try {
      await getConnection().transaction(async (manager) => {
        await manager.save(returning);
      });
    } catch (err) {
      throw new BadRequestException(err.sqlMessage);
    }
    console.log(ReservationsService.isReservation());
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
