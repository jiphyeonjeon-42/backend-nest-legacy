import { Injectable } from '@nestjs/common';
import { ftTypes } from 'src/auth/auth.service';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { lastValueFrom, delay, retry } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  TOO_MANY_REQUESTS = 429;
  FT_SEOUL_CAMPUS_ID = 29;
  FT_OAUTH_TOKEN_API_URL = 'https://api.intra.42.fr/oauth/token';
  FT_USERS_API_URL = 'https://api.intra.42.fr/v2/users';

  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
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

  async userFind(userId: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { login: userId },
    });
    return existingUser;
  }

  async searchByLogin(login: string, options: IPaginationOptions) {
    const queryBuilder = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.reservations',
        'reservations',
        'reservations.canceledAt IS NULL AND (reservations.endAt IS NULL OR reservations.endAt >= :current)',
        { current: new Date() },
      )
      .leftJoinAndSelect('reservations.book', 'reservationsBook')
      .leftJoinAndSelect('reservationsBook.info', 'reservationsBookInfo')
      .leftJoinAndSelect(
        'reservationsBook.lendings',
        'reservationsBookLendings',
      )
      .leftJoinAndSelect(
        'user.lendings',
        'lendings',
        'NOT EXISTS(SELECT * FROM returning where returning.lendingId = lendings.id)',
      )
      .leftJoinAndSelect('lendings.book', 'lendingsBook')
      .leftJoinAndSelect('lendingsBook.info', 'lendingsBookInfo')
      .where('user.login like :login', { login: `%${login}%` });
    return paginate(queryBuilder, options);
  }

  async authorizeFortyTwo() {
    const body = {
      grant_type: 'client_credentials',
      client_id: this.configService.get('client.id'),
      client_secret: this.configService.get('client.secret'),
    };

    const observable = this.httpService.post(this.FT_OAUTH_TOKEN_API_URL, body);
    const response = await lastValueFrom(observable);
    const accessToken = response['data']['access_token'];
    return accessToken;
  }

  async getFortyTwoUsers(token: string) {
    const maxPage = await this.getMaxPage(token);
    const promises: Promise<any[]>[] = [];
    for (let page = 1; page <= maxPage; page++) {
      promises.push(this.getPaginatedFortyTwoUsers(token, page));
    }
    const fortyTwoUsers = (await Promise.all(promises)).flat();
    return fortyTwoUsers;
  }

  async getMaxPage(token: string) {
    const observable = this.httpService.head(this.FT_USERS_API_URL, {
      params: {
        'filter[primary_campus_id]': this.FT_SEOUL_CAMPUS_ID,
        per_page: 100,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await lastValueFrom(observable);
    const perPage = Number(response.headers['x-per-page']);
    const total = Number(response.headers['x-total']);
    return Math.ceil(total / perPage);
  }

  async getPaginatedFortyTwoUsers(
    token: string,
    page: number,
    retryAfter?: number,
  ) {
    try {
      let observable = await this.requestPaginatedFortyTwoUsers(token, page);
      if (retryAfter) observable = observable.pipe(delay(retryAfter * 1000));
      const response = await lastValueFrom(observable);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === this.TOO_MANY_REQUESTS) {
        const retryAfter = Number(e.response.headers['retry-after']);
        return this.getPaginatedFortyTwoUsers(token, page, retryAfter);
      } else {
        console.error(e);
      }
    }
  }

  async requestPaginatedFortyTwoUsers(token: string, page: number) {
    return await this.httpService.get(this.FT_USERS_API_URL, {
      params: {
        'filter[primary_campus_id]': this.FT_SEOUL_CAMPUS_ID,
        per_page: 100,
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
