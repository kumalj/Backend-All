import { Test, TestingModule } from '@nestjs/testing';
import { GetCrController } from './getcr.controller';
import { GetCrService } from './getcr.service';

describe('CrPrototypeController', () => {
  let controller: GetCrController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetCrController],
      providers: [GetCrService],
    }).compile();

    controller = module.get<GetCrController>(GetCrController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
