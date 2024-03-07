import { Test, TestingModule } from '@nestjs/testing';
import { CrPrototypeController } from './cr-prototype.controller';
import { CrPrototypeService } from './cr-prototype.service';

describe('CrPrototypeController', () => {
  let controller: CrPrototypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrPrototypeController],
      providers: [CrPrototypeService],
    }).compile();

    controller = module.get<CrPrototypeController>(CrPrototypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
