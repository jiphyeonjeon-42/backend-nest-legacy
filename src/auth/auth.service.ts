import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import axios, { AxiosResponse } from 'axios';

export interface tokenTypes {
  access_token: string;
  token_type: string;
  expires_in: string;
  refresh_token: string;
  scope: string;
  created_at: string;
}

export interface ftTypes {
  id: number;
  intraid: string;
  image: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async jwtGen(user: any) {
    const payload = { username: user.login, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async connectToken(code: string): Promise<tokenTypes> {
    const getTokenUrl = 'https://api.intra.42.fr/oauth/token';
    const request = {
      grant_type: process.env.GRANT_TYPE,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.REDIRECT_URL,
    };
    //console.log(request);
    try {
      const response: AxiosResponse = await axios.post(getTokenUrl, request, {
        headers: {
          accept: 'application/json', // json으로 반환을 요청합니다.
        },
      });
      //console.log(response.data);
      return response.data;
    } catch (error) {
      // 에러 발생시
      throw '42 인증을 실패했습니다.';
    }
  }

  async connectFt(ftToken: string) {
    const ft_oauthUrl = 'https://api.intra.42.fr/v2/me';
    const { data } = await axios.get(ft_oauthUrl, {
      headers: {
        Authorization: 'Bearer ' + ftToken,
      },
    });
    const { id, login, image_url } = data;
    const ftUserInfo: ftTypes = {
      id: id,
      intraid: login,
      image: image_url,
    };
    return ftUserInfo;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getToken(ftUserInfo: User) {
    const payload = { username: ftUserInfo.login, sub: ftUserInfo.intra };
    return this.jwtService.sign(payload);
  }
}
