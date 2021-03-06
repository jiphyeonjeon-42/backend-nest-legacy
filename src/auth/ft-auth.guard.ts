import { Injectable, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FtAuthGuard extends AuthGuard('ftSeoul') {
  constructor(private configService: ConfigService) {
    super();
  }
  handleRequest(err, user, info, context: ExecutionContext) {
    //Nope, I don't 선택
    if (err || !user) {
      const res = context.switchToHttp().getResponse();
      return res
        .status(401)
        .redirect(this.configService.get('auth.callbackUrl'));
    }
    return user;
  }
}
