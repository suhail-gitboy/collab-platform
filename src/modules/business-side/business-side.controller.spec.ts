import { Test, TestingModule } from '@nestjs/testing';
import { BusinessSideController } from './business-side.controller';
import { BusinessSideService } from './business-side.service';

describe('BusinessSideController', () => {
  let controller: BusinessSideController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessSideController],
      providers: [BusinessSideService],
    }).compile();

    controller = module.get<BusinessSideController>(BusinessSideController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
