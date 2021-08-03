import { Test, TestingModule } from '@nestjs/testing';
import { LendingsController } from './lendings.controller';
import { LendingsService } from './lendings.service';

describe('LendingsController', () => {
  let controller: LendingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LendingsController],
      providers: [LendingsService],
    }).compile();

    controller = module.get<LendingsController>(LendingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
