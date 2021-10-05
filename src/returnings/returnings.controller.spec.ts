import { Test, TestingModule } from '@nestjs/testing';
import { ReturningsController } from './returnings.controller';
import { ReturningsService } from './returnings.service';

describe('ReturningsController', () => {
  let controller: ReturningsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReturningsController],
      providers: [ReturningsService],
    }).compile();

    controller = module.get<ReturningsController>(ReturningsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
