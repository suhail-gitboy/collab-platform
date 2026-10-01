import { Test, TestingModule } from '@nestjs/testing';
import { SocialaccountService } from './socialaccount.service';

describe('SocialaccountService', () => {
  let service: SocialaccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialaccountService],
    }).compile();

    service = module.get<SocialaccountService>(SocialaccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
