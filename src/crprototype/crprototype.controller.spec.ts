import { Test, TestingModule } from '@nestjs/testing';
import { CrprototypeController } from './crprototype.controller';
import { CrprototypeService } from './crprototype.service';

describe('CrprototypeController', () => {
  let controller: CrprototypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrprototypeController],
      providers: [CrprototypeService],
    }).compile();

    controller = module.get<CrprototypeController>(CrprototypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
