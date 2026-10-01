import { Test, TestingModule } from '@nestjs/testing';
import { CreatorCollaborationService } from './post.service';

describe('CreatorCollaborationService', () => {
  let service: CreatorCollaborationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatorCollaborationService],
    }).compile();

    service = module.get<CreatorCollaborationService>(CreatorCollaborationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
