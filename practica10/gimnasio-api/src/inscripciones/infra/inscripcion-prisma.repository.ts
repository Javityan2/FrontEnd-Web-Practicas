import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generado/prisma/client';
import type { InscripcionRepository } from '../dominio/inscripcion.repository';
import type { NuevaInscripcion } from '../dominio/entidades';

@Injectable()
export class InscripcionPrismaRepository implements InscripcionRepository {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.inscripcion.findMany({ orderBy: { id: 'asc' } });
  }
  buscarPorId(id: number) {
    return this.prisma.inscripcion.findUnique({ where: { id } });
  }
  buscarPorHorario(horarioId: number) {
    return this.prisma.inscripcion.findMany({ where: { horarioId } });
  }
  buscarHorario(id: number) {
    return this.prisma.horario.findUnique({ where: { id } });
  }
  buscarMiembro(id: number) {
    return this.prisma.miembro.findUnique({ where: { id } });
  }
  guardar(datos: NuevaInscripcion) {
    const { horarioId, miembroId } = datos;
    return this.prisma.inscripcion.upsert({
      where: { horarioId_miembroId: { horarioId, miembroId } },
      create: { horarioId, miembroId },
      update: { estado: 'confirmada' },
    });
  }
  async cancelar(id: number) {
    try {
      return await this.prisma.inscripcion.update({
        where: { id }, data: { estado: 'cancelada' },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2025') return null;
      throw error;
    }
  }
}