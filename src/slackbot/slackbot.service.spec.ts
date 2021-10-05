import { Test, TestingModule } from '@nestjs/testing';
import { SlackbotService } from './slackbot.service';

describe('SlackbotService', () => {
  let service: SlackbotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlackbotService],
    }).compile();

    service = module.get<SlackbotService>(SlackbotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
