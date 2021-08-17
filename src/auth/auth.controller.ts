import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { AuthService, ftTypes } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(AuthGuard('ftSeoul'))
  @Get('token')
  @Redirect('http://localhost:3000/auth/', 302)
  async getToken(@Req() req) {
    const jwtToken = await this.authService.login(req.user);
    console.log('jwt_value: ' + jwtToken);
    const { id, login, image_url } = req.user;
    const ftUserInfo: ftTypes = {
      id: id,
      intraid: login,
      image: image_url,
    };
    //console.log(ftUserInfo);
    if ((await this.userService.userSearch(ftUserInfo)) === 'find') {
      console.log('DB에 이미 있는 사람입니다.');
      return;
    }
    console.log('DB에 없는 사람입니다.');
    return this.userService.userSave(ftUserInfo);
  }

  @UseGuards(AuthGuard('ftSeoul'))
  @Get('me')
  async ftAuthRedirect(@Req() req) {
    //console.log(req.user);
    //const tokenInfo = await this.authService.connectToken(ftToken);
    //const access_token = tokenInfo.access_token;
    //const userInfo = await this.authService.connectFt(req);
    //const user = new User(userInfo.id, userInfo.intraid);
    // const getToken = await this.authService.getToken(user);
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
