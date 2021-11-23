import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ClientURLValidationPipe implements PipeTransform {
  CLIENT_DEV_URL = 'http://localhost:3000';
  CLIENT_PRODUCTION_URL = 'https://42library.kr';

  transform(value: any) {
    if (value !== this.CLIENT_DEV_URL && value !== this.CLIENT_PRODUCTION_URL) {
      throw new BadRequestException('invalid client url');
    }
    return value;
  }
}
