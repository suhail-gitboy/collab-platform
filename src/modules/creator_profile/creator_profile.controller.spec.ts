import { Test, TestingModule } from '@nestjs/testing';
import { CreatorProfileController } from './creator_profile.controller';
import { CreatorProfileService } from './creator_profile.service';

describe('CreatorProfileController', () => {
  let controller: CreatorProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatorProfileController],
      providers: [CreatorProfileService],
    }).compile();

    controller = module.get<CreatorProfileController>(CreatorProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
