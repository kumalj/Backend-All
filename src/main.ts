/* eslint-disable prettier/prettier */
// In your NestJS main.ts file
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
 
  const app = await NestFactory.create(AppModule);                     

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors(
    {origin:'http://localhost:5173',
  credentials:true}
  ); // Enable CORS

  await app.listen(3000);
}
bootstrap();
