import { Test, TestingModule } from '@nestjs/testing';
import { CRPrototypeService } from './crprototype.service';

describe('CrprototypeService', () => {
  let service: CRPrototypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CRPrototypeService],
    }).compile();

    service = module.get<CRPrototypeService>(CRPrototypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
