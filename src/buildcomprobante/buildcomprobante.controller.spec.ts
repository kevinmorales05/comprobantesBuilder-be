import { Test, TestingModule } from '@nestjs/testing';
import { BuildcomprobanteController } from './buildcomprobante.controller';

describe('BuildcomprobanteController', () => {
  let controller: BuildcomprobanteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuildcomprobanteController],
    }).compile();

    controller = module.get<BuildcomprobanteController>(BuildcomprobanteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
