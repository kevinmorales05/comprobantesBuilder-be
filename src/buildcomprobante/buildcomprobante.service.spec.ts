import { Test, TestingModule } from '@nestjs/testing';
import { BuildcomprobanteService } from './buildcomprobante.service';

describe('BuildcomprobanteService', () => {
  let service: BuildcomprobanteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuildcomprobanteService],
    }).compile();

    service = module.get<BuildcomprobanteService>(BuildcomprobanteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
