/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import path from 'path';

async function bootstrap() {
 
  const app = await NestFactory.create(AppModule);                     

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use('/uploads/prototype', express.static('../uploads/prototype'));
  
  app.enableCors(
    {origin:'http://localhost:5173',
  credentials:true}
  ); // Enable CORS

  await app.listen(3000);
}
bootstrap();
