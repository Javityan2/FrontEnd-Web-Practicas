import { Inject, Injectable } from '@nestjs/common';
import { INSCRIPCION_REPOSITORY } from './dominio/inscripcion.repository';
import type { InscripcionRepository } from './dominio/inscripcion.repository';
import type { Inscripcion } from './dominio/entidades';
import type { CrearInscripcionDto } from './dto/crear-inscripcion.dto';
import {
  HorarioNoEncontradoError,
  MiembroNoEncontradoError,
  InscripcionDuplicadaError,
  CupoLlenoError,
} from './dominio/errores';

@Injectable()
export class InscripcionesService {
  constructor(
    @Inject(INSCRIPCION_REPOSITORY)
    private readonly repo: InscripcionRepository,
  ) {}

  listar(): Promise<Inscripcion[]> {
    return this.repo.listar();
  }

  async crear(dto: CrearInscripcionDto): Promise<Inscripcion> {
    const horario = await this.repo.buscarHorario(dto.horarioId);

    if (!horario) {
      throw new HorarioNoEncontradoError(dto.horarioId);
    }

    const miembro = await this.repo.buscarMiembro(dto.miembroId);

    if (!miembro) {
      throw new MiembroNoEncontradoError(dto.miembroId);
    }

    const inscripciones = await this.repo.buscarPorHorario(dto.horarioId);

    const confirmadas = inscripciones.filter(
      (inscripcion) => inscripcion.estado === 'confirmada',
    );

    const duplicada = confirmadas.some(
      (inscripcion) => inscripcion.miembroId === dto.miembroId,
    );

    if (duplicada) {
      throw new InscripcionDuplicadaError(dto.horarioId, dto.miembroId);
    }

    if (confirmadas.length >= horario.cupoMaximo) {
      throw new CupoLlenoError(dto.horarioId, horario.cupoMaximo);
    }

    return this.repo.guardar({
      horarioId: dto.horarioId,
      miembroId: dto.miembroId,
    });
  }

  cancelar(id: number): Promise<Inscripcion | null> {
    return this.repo.cancelar(id);
  }
}