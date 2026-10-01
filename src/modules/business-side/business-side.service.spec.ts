import { Test, TestingModule } from '@nestjs/testing';
import { BusinessSideService } from './business-side.service';

describe('BusinessSideService', () => {
  let service: BusinessSideService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessSideService],
    }).compile();

    service = module.get<BusinessSideService>(BusinessSideService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
