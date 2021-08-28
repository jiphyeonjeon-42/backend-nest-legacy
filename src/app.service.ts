import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(__dirname);
    return process.env.HA;
  }
}
