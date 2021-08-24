import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

export class UserInfo {
  intra: number;
  login: string;
  image: string;
  constructor(id: number, intraid: string, image: string) {
    this.intra = id;
    this.login = intraid;
    this.image = image;
  }
}

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ftSeoul') {
  constructor() {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    try {
      const { id, login, image_url } = profile._json;
      const user = {
        id: id,
        login: login,
        image_url: image_url,
        accessToken,
        refreshToken,
      };
      return user;
    } catch (e) {
      throw e;
    }
  }
}
