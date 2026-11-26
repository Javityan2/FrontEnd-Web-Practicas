import { Injectable } from '@nestjs/common';
import { Inscripcion, InscripcionDetallada, NuevaInscripcion } from '../dominio/entidades';
import { InscripcionRepository } from '../dominio/inscripcion.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InscripcionPrismaRepository implements InscripcionRepository {
  constructor(private readonly prisma: PrismaService) {}

  listar(): Promise<Inscripcion[]> {
    return this.prisma.inscripcion.findMany() as Promise<Inscripcion[]>;
  }

  buscarPorId(id: number): Promise<Inscripcion | null> {
    return this.prisma.inscripcion.findUnique({ where: { id } }) as Promise<Inscripcion | null>;
  }

  async listarDeMiembro(miembroId: number): Promise<InscripcionDetallada[]> {
    const filas = await this.prisma.inscripcion.findMany({
      where: { miembroId, estado: 'confirmada' },
      orderBy: { creadaEn: 'desc' },
      include: { horario: { include: { clase: true } } },
    });
    return filas.map((f) => ({
      id: f.id,
      estado: f.estado as InscripcionDetallada['estado'],
      creadaEn: f.creadaEn,
      horario: {
        id: f.horario.id,
        dia: f.horario.dia,
        horaInicio: f.horario.horaInicio,
        entrenador: f.horario.entrenador,
      },
      clase: { id: f.horario.clase.id, nombre: f.horario.clase.nombre, imagen: f.horario.clase.imagen },
    }));
  }

  buscarPorHorario(horarioId: number): Promise<Inscripcion[]> {
    return this.prisma.inscripcion.findMany({ where: { horarioId } }) as Promise<Inscripcion[]>;
  }

  buscarHorario(horarioId: number) {
    return this.prisma.horario.findUnique({ where: { id: horarioId } });
  }

  buscarMiembro(miembroId: number) {
    return this.prisma.miembro.findUnique({ where: { id: miembroId } });
  }

  guardar(datos: NuevaInscripcion): Promise<Inscripcion> {
    return this.prisma.inscripcion.create({
      data: { horarioId: datos.horarioId, miembroId: datos.miembroId, estado: 'confirmada' },
    }) as Promise<Inscripcion>;
  }

  async cancelar(id: number): Promise<Inscripcion | null> {
    const existe = await this.prisma.inscripcion.findUnique({ where: { id } });
    if (!existe) return null;
    return this.prisma.inscripcion.update({
      where: { id },
      data: { estado: 'cancelada' },
    }) as Promise<Inscripcion>;
  }
}
