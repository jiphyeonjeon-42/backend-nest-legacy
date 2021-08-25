import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ftTypes } from 'src/auth/auth.service';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository, // 1. DB와의 연결을 정의
  ) {}

  async findOne(id: string): Promise<User> {
    let user: User = null;
    try {
      user = await this.userRepository.findOne(id);
    } catch (e) {
      throw e;
    }
    return user;
  }

  async userSave(user: ftTypes): Promise<User | undefined> {
    const createdUser = new User(user.intraid, user.id);
    return this.userRepository.save(createdUser);
  }

  async userSearch(user: ftTypes): Promise<string> {
    const existingUser = await this.userRepository.findOne({
      where: { intra: user.id },
    });
    if (!existingUser) return 'save';
    return 'find';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  // userSave(user: ftTypes) {
  //   console.log('Hello!!');
  //   return user;
  //}

  // async findOne(username: string): Promise<User | undefined> {
  //   return this.users.find((user) => user.username === username);
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
