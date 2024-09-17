import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildcomprobanteModule } from './buildcomprobante/buildcomprobante.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BuildcomprobanteModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
