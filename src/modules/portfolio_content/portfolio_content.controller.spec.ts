import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioContentController } from './portfolio_content.controller';
import { PortfolioContentService } from './portfolio_content.service';

describe('PortfolioContentController', () => {
  let controller: PortfolioContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortfolioContentController],
      providers: [PortfolioContentService],
    }).compile();

    controller = module.get<PortfolioContentController>(PortfolioContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
