import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebClient, LogLevel } from '@slack/web-api';

@Injectable()
export class SlackbotService {
  constructor(private configService: ConfigService) {}
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
      console.log('일치하는 슬랙아이디가 없습니다.');
    }
  }
}
