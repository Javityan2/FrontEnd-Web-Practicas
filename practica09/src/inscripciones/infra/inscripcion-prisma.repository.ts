import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generado/prisma/client';
import type {
  Horario,
  Inscripcion,
  Miembro,
  NuevaInscripcion,
} from '../dominio/entidades';
import type { InscripcionRepository } from '../dominio/inscripcion.repository';

@Injectable()
export class InscripcionPrismaRepository
  implements InscripcionRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Inscripcion[]> {
    return this.prisma.inscripcion.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async buscarPorId(id: number): Promise<Inscripcion | null> {
    return this.prisma.inscripcion.findUnique({
      where: { id },
    });
  }

  async buscarPorHorario(horarioId: number): Promise<Inscripcion[]> {
    return this.prisma.inscripcion.findMany({
      where: { horarioId },
    });
  }

  async buscarHorario(horarioId: number): Promise<Horario | null> {
    return this.prisma.horario.findUnique({
      where: { id: horarioId },
    });
  }

  async buscarMiembro(miembroId: number): Promise<Miembro | null> {
    return this.prisma.miembro.findUnique({
      where: { id: miembroId },
    });
  }

  async guardar(datos: NuevaInscripcion): Promise<Inscripcion> {
    const anterior = await this.prisma.inscripcion.findUnique({
      where: {
        horarioId_miembroId: {
          horarioId: datos.horarioId,
          miembroId: datos.miembroId,
        },
      },
    });

    if (anterior?.estado === 'cancelada') {
      return this.prisma.inscripcion.update({
        where: { id: anterior.id },
        data: { estado: 'confirmada' },
      });
    }

    return this.prisma.inscripcion.create({
      data: {
        horarioId: datos.horarioId,
        miembroId: datos.miembroId,
      },
    });
  }

  async cancelar(id: number): Promise<Inscripcion | null> {
    try {
      return await this.prisma.inscripcion.update({
        where: { id },
        data: { estado: 'cancelada' },
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