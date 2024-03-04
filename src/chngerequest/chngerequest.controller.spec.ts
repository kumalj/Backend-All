import { Test, TestingModule } from '@nestjs/testing';
import { ChngerequestController } from './chngerequest.controller';
import { ChngerequestService } from './chngerequest.service';

describe('ChngerequestController', () => {
  let controller: ChngerequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChngerequestController],
      providers: [ChngerequestService],
    }).compile();

    controller = module.get<ChngerequestController>(ChngerequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
