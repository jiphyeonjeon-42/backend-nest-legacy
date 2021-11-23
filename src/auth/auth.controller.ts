import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService, ftTypes } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { FtAuthGuard } from './ft-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ClientURLValidationPipe } from './validation.pipe';

@Controller('auth')
export class AuthController {
  FRONTEND_DEV_URL = 'http://localhost:3000';

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Get('oauth')
  async oauth(
    @Res({ passthrough: true }) res: Response,
    @Query('clientURL') clientURL = this.FRONTEND_DEV_URL,
  ) {
    const clientId = this.configService.get('client.id');
    const redirct_url = this.configService.get('client.redirect_url');
    const oauthUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirct_url}&response_type=code&state=${clientURL}`;
    res.status(302).redirect(oauthUrl);
  }

  @UseGuards(FtAuthGuard)
  @Get('token')
  async getToken(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Query('state', new ClientURLValidationPipe()) clientURL,
  ) {
    if (req.user) {
      const { intra, login, image_url } = req.user;
      const ftUserInfo: ftTypes = {
        intra,
        login,
        image: image_url,
      };
      let user = await this.userService.userFind(ftUserInfo.login);
      if (!user) {
        user = await this.userService.userSave(ftUserInfo);
      }
      const jwtToken = await this.authService.jwtGen(req.user, user.id);

      res.cookie('access_token', jwtToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 15 * 1000 * 60 * 60 * 24),
      });
      return res.status(302).redirect(clientURL + '/auth');
    } else {
      return;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async profile(@Req() req) {
    const { id, login, image } = req.user;
    const findUser = await this.userService.findOne(id);
    const ftUserInfo = {
      id: id,
      intra: login,
      librarian: findUser.librarian,
      imageUrl: image,
    };
    return ftUserInfo;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    res.cookie('access_token', null, {
      maxAge: 0,
      httpOnly: true,
    });
    res.status(204);
  }
}

//console.log(req.user);
//const tokenInfo = await this.authService.connectToken(ftToken);
//const access_token = tokenInfo.access_token;
//const userInfo = await this.authService.connectFt(req);
//const user = new User(userInfo.id, userInfo.intraid);
// const getToken = await this.authService.getToken(user);
