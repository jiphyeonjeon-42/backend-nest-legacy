import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'ftSeoul') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('client.id'),
      clientSecret: configService.get('client.secret'),
      callbackURL: configService.get('client.redirect_url'),
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
        intra: id,
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
