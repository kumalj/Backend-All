import { Test, TestingModule } from '@nestjs/testing';
import { ChangeRequestService } from './change-request.service';

describe('ChangeRequestService', () => {
  let service: ChangeRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangeRequestService],
    }).compile();

    service = module.get<ChangeRequestService>(ChangeRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
