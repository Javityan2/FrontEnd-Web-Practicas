import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClasesModule } from './clases/clases.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { MiembrosModule } from './miembros/miembros.module';

@Module({
  imports: [ClasesModule, InscripcionesModule, MiembrosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
