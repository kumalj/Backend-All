import { Test, TestingModule } from '@nestjs/testing';
import { CrPController } from './cr-p.controller';
import { CrPService } from './cr-p.service';

describe('CrPController', () => {
  let controller: CrPController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrPController],
      providers: [CrPService],
    }).compile();

    controller = module.get<CrPController>(CrPController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
