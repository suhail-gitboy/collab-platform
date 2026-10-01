import { Test, TestingModule } from '@nestjs/testing';
import { CreatorCollaborationController } from './creator-collaboration.controller';
import { CreatorCollaborationService } from './post.service';

describe('CreatorCollaborationController', () => {
  let controller: CreatorCollaborationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatorCollaborationController],
      providers: [CreatorCollaborationService],
    }).compile();

    controller = module.get<CreatorCollaborationController>(CreatorCollaborationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
