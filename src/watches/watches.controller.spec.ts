import { Test, TestingModule } from '@nestjs/testing';
import { WatchesController } from './watches.controller';
import { WatchesService } from './watches.service';

describe('WatchesController', () => {
  let controller: WatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WatchesController],
      providers: [WatchesService],
    }).compile();

    controller = module.get<WatchesController>(WatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
