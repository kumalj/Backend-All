import { Test, TestingModule } from '@nestjs/testing';
import { CrpService } from './cr-p.service';

describe('CrPService', () => {
  let service: CrpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrpService],
    }).compile();

    service = module.get<CrpService>(CrpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
