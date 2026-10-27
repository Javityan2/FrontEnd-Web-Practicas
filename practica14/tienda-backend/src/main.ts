// tienda-backend: la API de la tienda. Mismo arranque que el gimnasio de la Unidad II.
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SobreInterceptor } from './comun/sobre.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: el frontend de Vite vive en otro puerto (5173).
  app.enableCors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] });
  // Valida los DTO y rechaza campos que no estén declarados.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  // Toda respuesta exitosa sale como { data, meta } (Práctica 9B).
  app.useGlobalInterceptors(new SobreInterceptor());

  await app.listen(process.env.PORT ?? 3000);
  console.log('tienda-backend en http://localhost:3000/productos');
}
bootstrap();
