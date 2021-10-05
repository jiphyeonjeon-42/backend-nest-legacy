import { date } from '@hapi/joi';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient, LogLevel } from '@slack/web-api';
import { channel } from 'diagnostics_channel';

@Injectable()
export class SlackbotService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}
  async publishMessage(slackId: string, text: string) {
    try {
      const client = new WebClient(
        this.configService.get('slack.access_token'),
        {
          logLevel: LogLevel.DEBUG,
        },
      );
      await client.chat.postMessage({
        // The token you used to initialize your app
        token: this.configService.get('slack.access_token'),
        channel: slackId,
        text: text,
      });
    } catch (error) {
      console.error(error);
    }
  }
  // async publishMessage(id: string, text: string) {
  //   const result = this.httpService.post(
  //     'https://slack.com/api/chat.postMessage',
  //     {
  //       data: {
  //         text: text,
  //         channel: id,
  //       },
  //       headers: {
  //         accept: 'application/json',
  //         Authorization: this.configService.get('slack.access_token'),
  //       },
  //     },
  //   );
  //   console.log(result);
  // }
}
