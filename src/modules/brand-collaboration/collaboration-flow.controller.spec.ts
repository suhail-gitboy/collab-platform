import { Test, TestingModule } from '@nestjs/testing';
import { CollaborationFlowController } from './collaboration-flow.controller';
import { CollaborationFlowService } from './collaboration-flow.service';

describe('CollaborationFlowController', () => {
  let controller: CollaborationFlowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollaborationFlowController],
      providers: [CollaborationFlowService],
    }).compile();

    controller = module.get<CollaborationFlowController>(CollaborationFlowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
