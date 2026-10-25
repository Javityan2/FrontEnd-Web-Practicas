import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generado/prisma/client';
import type { Horario } from '../dominio/entidades';
import type { HorarioRepository } from '../dominio/horario.repository';
import type { CrearHorarioDto } from '../dto/crear-horario.dto';
import type { ActualizarHorarioDto } from '../dto/actualizar-horario.dto';

@Injectable()
export class HorarioPrismaRepository implements HorarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Horario[]> {
    return this.prisma.horario.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async buscarPorId(id: number): Promise<Horario | null> {
    return this.prisma.horario.findUnique({
      where: { id },
    });
  }

  async crear(datos: CrearHorarioDto): Promise<Horario> {
    return this.prisma.horario.create({
      data: {
        claseId: datos.claseId,
        dia: datos.dia,
        horaInicio: datos.horaInicio,
        cupoMaximo: datos.cupoMaximo,
        entrenador: datos.entrenador,
      },
    });
  }

  async actualizar(
    id: number,
    datos: ActualizarHorarioDto,
  ): Promise<Horario | null> {
    try {
      return await this.prisma.horario.update({
        where: { id },
        data: {
          claseId: datos.claseId,
          dia: datos.dia,
          horaInicio: datos.horaInicio,
          cupoMaximo: datos.cupoMaximo,
          entrenador: datos.entrenador,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }

      throw error;
    }
  }

  async eliminar(id: number): Promise<Horario | null> {
    try {
      return await this.prisma.horario.delete({
        where: { id },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null;
      }

      throw error;
    }
  }
}