import { Module } from '@nestjs/common';
import { BuildcomprobanteController } from './buildcomprobante.controller';
import { BuildcomprobanteService } from './buildcomprobante.service';

@Module({
  controllers: [BuildcomprobanteController],
  providers: [BuildcomprobanteService]
})
export class BuildcomprobanteModule {}
