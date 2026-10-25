import { Module } from '@nestjs/common';
import { MiembrosController } from './miembros.controller';
import { MiembrosService } from './miembros.service';
import { MiembroPrismaRepository } from './infra/miembro-prisma.repository';
import { MIEMBRO_REPOSITORY } from './miembros.tokens';

@Module({
  controllers: [MiembrosController],
  providers: [
    MiembrosService,
    {
      provide: MIEMBRO_REPOSITORY,
      useClass: MiembroPrismaRepository,
      //         ^^^^^^^^^^^^^^^^^^^^^^^^
      // Practica 8 (Prisma): esta linea pasa a MiembroPrismaRepository.
      // Ni el Service ni el Controller se enteran.
    },
  ],
  exports: [MiembrosService],
})
export class MiembrosModule {}
