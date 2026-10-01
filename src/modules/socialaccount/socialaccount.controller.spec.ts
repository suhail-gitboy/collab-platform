import { Test, TestingModule } from '@nestjs/testing';
import { SocialaccountController } from './socialaccount.controller';
import { SocialaccountService } from './socialaccount.service';

describe('SocialaccountController', () => {
  let controller: SocialaccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialaccountController],
      providers: [SocialaccountService],
    }).compile();

    controller = module.get<SocialaccountController>(SocialaccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
