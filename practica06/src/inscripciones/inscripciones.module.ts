import { Module } from '@nestjs/common';
import { InscripcionesController } from './inscripciones.controller';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionMemoriaRepository } from './infra/inscripcion-memoria.repository';
import { INSCRIPCION_REPOSITORY } from './dominio/inscripcion.repository';

@Module({
  controllers: [InscripcionesController],
  providers: [
    InscripcionesService,
    {
      provide: INSCRIPCION_REPOSITORY,
      useClass: InscripcionMemoriaRepository,
    },
  ],
})
export class InscripcionesModule {}