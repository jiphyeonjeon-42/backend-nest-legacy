import { Injectable } from '@nestjs/common';
import { ftTypes } from 'src/auth/auth.service';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository, // 1. DB와의 연결을 정의
  ) {}

  async findOne(id: number): Promise<User> {
    let user: User = null;
    try {
      user = await this.userRepository.findOne({ where: { id } });
    } catch (e) {
      throw e;
    }
    return user;
  }

  async userSave(user: ftTypes): Promise<User | undefined> {
    const createdUser = new User({ login: user.login, intra: user.intra });
    return this.userRepository.save(createdUser);
  }

  async userSearch(user: ftTypes): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { intra: user.intra },
    });
    return existingUser;
  }

  async userFind(userId: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { login: userId },
    });
    return existingUser;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create() {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returnings all users`;
  }

  async searchByLogin(login: string, options: IPaginationOptions) {
    const queryBuilder = await this.userRepository
      .createQueryBuilder('user')
      .where('user.login like :login', { login: `%${login}%` });
    return paginate(queryBuilder, options);
  }
}
