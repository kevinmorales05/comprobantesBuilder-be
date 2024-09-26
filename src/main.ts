import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
//const cors = require("cors");
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));
  const corsOptions = {
    origin: '*', // Replace with the allowed domain
  };
  app.use(cors(corsOptions));
  const port = process.env.PORT || 3000; // 3000 es solo para desarrollo local
  await app.listen(port);
}
bootstrap();
