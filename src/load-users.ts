import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepository } from 'typeorm';
import { WebClient } from '@slack/web-api';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';
import { User } from './users/entities/user.entity';

async function saveUsers(users: User[]) {
  try {
    await getRepository(User).save(users);
  } catch (err) {
    throw err;
  }
}

async function getSlackUserMap(configService) {
  const slackClient = new WebClient(configService.get('slack.access_token'));

  let cursor;
  let users: any[] = [];
  while (cursor === undefined || cursor !== '') {
    try {
      process.stdout.write('.');
      const response = await slackClient.users.list({ cursor, limit: 1000 });
      cursor = response['response_metadata']['next_cursor'];
      users = users.concat(response['members']);
    } catch (err) {
      console.error(err);
    }
  }

  const userMap = new Map();
  for (const user of users) {
    const name = user['name'];
    const slackUserId = user['id'];
    userMap[name] = slackUserId;
  }
  return userMap;
}

async function createUserEntities(fortyTwoUsers: any[], slackUserMap) {
  const users = fortyTwoUsers.map((fortyTwoUser) => {
    const login = fortyTwoUser['login'];
    const slack = slackUserMap[login];
    if (slack)
      return new User({
        login,
        intra: fortyTwoUser['id'],
        slack,
        librarian: isLibrarian(login),
      });
  });
  return users.filter((user) => {
    return user !== undefined;
  });
}

function isLibrarian(login) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const librarians: any[] = require('./librarians.json');
  return librarians.includes(login);
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const usersService = app.get<UsersService>(UsersService);

  console.log('fetching 42 intra users...');
  const token = await usersService.authorizeFortyTwo();
  process.stdout.write('fetching 42 slack users.');
  const result = await Promise.all([
    usersService.getFortyTwoUsers(token),
    getSlackUserMap(configService),
  ]);
  process.stdout.write('\n');
  const fortyTwoUsers = result[0];
  const slackUserMap = result[1];
  const users = await createUserEntities(fortyTwoUsers, slackUserMap);
  console.log(`${users.length} users are fetched`);
  await saveUsers(users);
  console.log(`compelete!`);
  await app.close();
}
bootstrap();
