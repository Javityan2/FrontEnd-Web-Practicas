import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DominioExceptionFilter } from './comun/filtros/dominio.filter';
import { LoggingInterceptor } from './comun/interceptores/logging.interceptor';
import { SobreInterceptor } from './comun/interceptores/sobre.interceptor';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.useGlobalFilters(new DominioExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new SobreInterceptor(),
  );
  app.enableCors({
    origin: ['http://localhost:5173'],
    exposedHeaders: ['Location', 'X-Request-Id'],
  });
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  app.enableShutdownHooks();

  const configuracionSwagger = new DocumentBuilder()
  .setTitle('API del gimnasio')
  .setDescription('Clases, horarios, miembros e inscripciones')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const documentoSwagger = SwaggerModule.createDocument(
    app,
    configuracionSwagger,
  );

  SwaggerModule.setup('docs', app, documentoSwagger);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();