import { Test, TestingModule } from '@nestjs/testing';
import { ChangeRequestController } from './change-request.controller';

describe('ChangeRequestController', () => {
  let controller: ChangeRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChangeRequestController],
    }).compile();

    controller = module.get<ChangeRequestController>(ChangeRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
