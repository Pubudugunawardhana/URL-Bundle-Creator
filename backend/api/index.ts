import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

const server = express();
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    cachedApp = await NestFactory.create(AppModule, new ExpressAdapter(server));
    
    cachedApp.enableCors({
      origin: [
        'http://localhost:3001', 
        process.env.FRONTEND_URL || ''
      ].filter(Boolean),
      credentials: true,
    });
    
    cachedApp.setGlobalPrefix('api');
    cachedApp.useGlobalPipes(new ValidationPipe({ transform: true }));
    
    await cachedApp.init();
  }
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  server(req, res);
}
