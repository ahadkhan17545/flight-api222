import { Test, TestingModule } from '@nestjs/testing';
import { FlightsApiController } from './flights-api.controller';

describe('FlightsApiController', () => {
  let controller: FlightsApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlightsApiController],
    }).compile();

    controller = module.get<FlightsApiController>(FlightsApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
