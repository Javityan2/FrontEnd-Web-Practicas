import { Inject, Injectable } from '@nestjs/common';
import { MIEMBRO_REPOSITORY } from './miembros.tokens';
import type { MiembroRepository } from './dominio/miembro.repository';
import type { Miembro } from './dominio/entidades';
import type { CrearMiembroDto } from './dto/crear-miembro.dto';
import type { ActualizarMiembroDto } from './dto/actualizar-miembro.dto';

@Injectable()
export class MiembrosService {
  constructor(
    @Inject(MIEMBRO_REPOSITORY)
    private readonly repo: MiembroRepository,
  ) {}

  listar(): Promise<Miembro[]> {
    return this.repo.listar();
  }

  buscar(id: number): Promise<Miembro | null> {
    return this.repo.buscarPorId(id);
  }

  crear(datos: CrearMiembroDto): Promise<Miembro> {
    return this.repo.crear(datos);
  }

  actualizar(
    id: number,
    datos: ActualizarMiembroDto,
  ): Promise<Miembro | null> {
    return this.repo.actualizar(id, datos);
  }

  eliminar(id: number): Promise<boolean> {
    return this.repo.eliminar(id);
  }
}