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
  intra: number;
  login: string;
  image: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async jwtGen(user: any, id: number) {
    const payload = {
      login: user.login,
      id,
      image: user.image_url,
    };
    return this.jwtService.sign(payload);
  }
}
