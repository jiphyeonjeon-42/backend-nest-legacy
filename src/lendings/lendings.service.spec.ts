import { Test, TestingModule } from '@nestjs/testing';
import { LendingsService } from './lendings.service';

describe('LendingsService', () => {
  let service: LendingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LendingsService],
    }).compile();

    service = module.get<LendingsService>(LendingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
