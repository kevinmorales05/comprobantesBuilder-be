import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Comprobantes } from 'src/types/types';
import { Response } from 'express';
import { BuildcomprobanteService } from './buildcomprobante.service';

@Controller('buildcomprobante')
export class BuildcomprobanteController {
  constructor(private readonly pdfService: BuildcomprobanteService) {}
  @Post('generate')
  @HttpCode(201)
  async create(
    @Body() infoComprobante: Comprobantes,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.pdfService.sendComprobante(infoComprobante);
      //const result = await this.pdfService.generatePdf(infoComprobante);

      // Check the condition first
      if (result.code === '01') {
        console.log('el status es correcto');
        return res.status(HttpStatus.OK).json({
          status: 'success',
          message: `Comprobantes entregados con éxito al correo ${infoComprobante.emailToSend}`,
          code: '01',
        });
      }

      // Default response
      return res.status(HttpStatus.OK).json({
        status: 'success',
        message: 'Data processed successfully',
        code: '01',
      });
    } catch (error) {
      // Respond with a proper status for errors
      console.log('this is the error, ', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred',
        error: error.message,
      });
    }
  }
  @Post('sendInBunch')
  @HttpCode(201)
  async bunch(
    @Body() infoComprobante: Comprobantes,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.pdfService.sendInBunch(infoComprobante);
      //const result = await this.pdfService.generatePdf(infoComprobante);

      // Check the condition first
      if (result.code === '01') {
        console.log('el status es correcto');
        return res.status(HttpStatus.OK).json({
          status: 'success',
          message: `Comprobantes entregados con éxito al correo ${infoComprobante.emailToSend}`,
          code: '01',
        });
      }

      // Default response
      return res.status(HttpStatus.OK).json({
        status: 'success',
        message: 'Data processed successfully',
        code: '01',
      });
    } catch (error) {
      // Respond with a proper status for errors
      console.log('this is the error, ', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred',
        error: error.message,
      });
    }
  }
}

//
