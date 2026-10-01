import { Test, TestingModule } from '@nestjs/testing';
import { CreatorProfileService } from './creator_profile.service';

describe('CreatorProfileService', () => {
  let service: CreatorProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatorProfileService],
    }).compile();

    service = module.get<CreatorProfileService>(CreatorProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
