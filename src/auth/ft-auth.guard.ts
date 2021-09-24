import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FtAuthGuard extends AuthGuard('ftSeoul') {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      const res = context.switchToHttp().getResponse();
      return res.redirect('/');
    }
    return user;
  }
}
