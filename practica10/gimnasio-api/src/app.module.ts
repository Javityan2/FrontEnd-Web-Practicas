import { Module } from '@nestjs/common';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { PeticionIdMiddleware } from './comun/middleware/peticion-id.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClasesModule } from './clases/clases.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { MiembrosModule } from './miembros/miembros.module';
import { HorariosModule } from './horarios/horarios.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ClasesModule,
    InscripcionesModule,
    MiembrosModule,
    HorariosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PeticionIdMiddleware)
      .forRoutes('*');
  }
}
