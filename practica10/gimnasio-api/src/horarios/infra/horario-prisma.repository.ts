import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generado/prisma/client';
import type { HorarioRepository } from '../dominio/horario.repository';
import type { CrearHorarioDto } from '../dto/crear-horario.dto';
import type { ActualizarHorarioDto } from '../dto/actualizar-horario.dto';

@Injectable()
export class HorarioPrismaRepository implements HorarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.horario.findMany({ orderBy: { id: 'asc' } });
  }
  buscarPorId(id: number) {
    return this.prisma.horario.findUnique({ where: { id } });
  }
  async crear(datos: CrearHorarioDto) {
    try {
      return await this.prisma.horario.create({
        data: { claseId: datos.claseId, dia: datos.dia,
          horaInicio: datos.horaInicio, cupoMaximo: datos.cupoMaximo,
          entrenador: datos.entrenador },
      });
    } catch (error) {
      this.verificarClase(error);
      throw error;
    }
  }
  async actualizar(id: number, datos: ActualizarHorarioDto) {
    try {
      return await this.prisma.horario.update({
        where: { id },
        data: { claseId: datos.claseId, dia: datos.dia,
          horaInicio: datos.horaInicio, cupoMaximo: datos.cupoMaximo,
          entrenador: datos.entrenador },
      });
    } catch (error) {
      return this.manejarError(error);
    }
  }
  async eliminar(id: number) {
    try {
      return await this.prisma.horario.delete({ where: { id } });
    } catch (error) {
      return this.manejarError(error);
    }
  }
  private verificarClase(error: unknown): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003') {
      throw new NotFoundException('La clase indicada no existe');
    }
  }
  private manejarError(error: unknown): null {
    this.verificarClase(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025') return null;
    throw error;
  }
}