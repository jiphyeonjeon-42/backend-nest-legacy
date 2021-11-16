import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // console.log(roles[0]);
    // if (!roles) {
    //   return false;
    // }
    const request = context.switchToHttp().getRequest();
    const user = await this.userService.userFind(request.user.login);
    console.log(user);
    // if (roles[0] === 'admin' && user.librarian) return true;
    if (user.librarian) return true;
    return false;
  }
}
