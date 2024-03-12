import { Test, TestingModule } from '@nestjs/testing';
import { GetCrService } from './getcr.service';

describe('CrPrototypeService', () => {
  let service: GetCrService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetCrService],
    }).compile();

    service = module.get<GetCrService>(GetCrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
