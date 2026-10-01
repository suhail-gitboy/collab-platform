import { Test, TestingModule } from '@nestjs/testing';
import { CollaborationFlowService } from './collaboration-flow.service';

describe('CollaborationFlowService', () => {
  let service: CollaborationFlowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollaborationFlowService],
    }).compile();

    service = module.get<CollaborationFlowService>(CollaborationFlowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
