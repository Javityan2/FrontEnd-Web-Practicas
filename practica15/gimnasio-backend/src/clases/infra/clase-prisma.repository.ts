import { Injectable } from '@nestjs/common';
import { Clase, ClaseConHorarios } from '../dominio/entidades';
import { ClaseRepository } from '../dominio/clase.repository';
import { CrearClaseDto } from '../dto/crear-clase.dto';
import { ActualizarClaseDto } from '../dto/actualizar-clase.dto';
import { PrismaService } from '../../prisma/prisma.service';

// Implementa ClaseRepository con Prisma (MySQL).
@Injectable()
export class ClasePrismaRepository implements ClaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  listar(): Promise<Clase[]> {
    return this.prisma.clase.findMany();
  }

  buscarPorId(id: number): Promise<Clase | null> {
    return this.prisma.clase.findUnique({ where: { id } });
  }

  // Una sola consulta: los horarios de la clase y, en cada uno,
  // cuantas inscripciones CONFIRMADAS tiene (_count).
  async buscarConHorarios(id: number): Promise<ClaseConHorarios | null> {
    const clase = await this.prisma.clase.findUnique({
      where: { id },
      include: {
        horarios: {
          orderBy: { id: 'asc' },
          include: { _count: { select: { inscripciones: { where: { estado: 'confirmada' } } } } },
        },
      },
    });
    if (!clase) return null;
    return {
      ...clase,
      horarios: clase.horarios.map(({ _count, claseId: _claseId, ...h }) => ({
        ...h,
        disponibles: h.cupoMaximo - _count.inscripciones,
      })),
    };
  }

  crear(datos: CrearClaseDto): Promise<Clase> {
    return this.prisma.clase.create({ data: datos });
  }

  async actualizar(id: number, datos: ActualizarClaseDto): Promise<Clase | null> {
    const existe = await this.prisma.clase.findUnique({ where: { id } });
    if (!existe) return null;
    return this.prisma.clase.update({ where: { id }, data: datos });
  }

  async eliminar(id: number): Promise<Clase | null> {
    const existe = await this.prisma.clase.findUnique({ where: { id } });
    if (!existe) return null;
    return this.prisma.clase.delete({ where: { id } });
  }
}
