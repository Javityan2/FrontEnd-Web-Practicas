import { Module } from '@nestjs/common';
import { InscripcionesController } from './inscripciones.controller';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionPrismaRepository } from './infra/inscripcion-prisma.repository';
import { INSCRIPCION_REPOSITORY } from './inscripciones.tokens';

@Module({
  controllers: [InscripcionesController],
  providers: [
    InscripcionesService,
    {
      provide: INSCRIPCION_REPOSITORY,
      useClass: InscripcionPrismaRepository,
      //         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      // Practica 8 (Prisma): esta linea pasa a InscripcionPrismaRepository.
      // Ni el Service ni el Controller se enteran.
    },
  ],
})
export class InscripcionesModule {}
