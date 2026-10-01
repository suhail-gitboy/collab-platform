import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioContentService } from './portfolio_content.service';

describe('PortfolioContentService', () => {
  let service: PortfolioContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortfolioContentService],
    }).compile();

    service = module.get<PortfolioContentService>(PortfolioContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
