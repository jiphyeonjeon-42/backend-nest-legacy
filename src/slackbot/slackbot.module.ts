import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SlackbotService } from './slackbot.service';

@Module({
  imports: [HttpModule],
  providers: [SlackbotService],
  exports: [SlackbotService],
})
export class SlackbotModule {}
