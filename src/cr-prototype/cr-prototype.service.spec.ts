import { Test, TestingModule } from '@nestjs/testing';
import { CrPrototypeService } from './cr-prototype.service';

describe('CrPrototypeService', () => {
  let service: CrPrototypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrPrototypeService],
    }).compile();

    service = module.get<CrPrototypeService>(CrPrototypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
