import { Test, TestingModule } from '@nestjs/testing';
import { ReturningsService } from './returnings.service';

describe('ReturningsService', () => {
  let service: ReturningsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReturningsService],
    }).compile();

    service = module.get<ReturningsService>(ReturningsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
