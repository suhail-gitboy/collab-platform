import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { AuthenticatedSocketAdapter } from './modules/chat/adapter';
import { configData } from './config/configeration';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./cert/localhost-key.pem'),
    cert: fs.readFileSync('./cert/localhost.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions
  });

  app.useWebSocketAdapter(
    new AuthenticatedSocketAdapter(app)),


    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
