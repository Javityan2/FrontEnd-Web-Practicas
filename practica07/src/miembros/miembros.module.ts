import { Module } from '@nestjs/common';
import { MiembrosController } from './miembros.controller';
import { MiembrosService } from './miembros.service';
import { MIEMBRO_REPOSITORY } from './miembros.tokens';
import { MiembroMemoriaRepository } from './infra/miembro-memoria.repository';

@Module({
  controllers: [MiembrosController],
  providers: [
    MiembrosService,
    {
      provide: MIEMBRO_REPOSITORY,
      useClass: MiembroMemoriaRepository,
    },
  ],
})
export class MiembrosModule {}