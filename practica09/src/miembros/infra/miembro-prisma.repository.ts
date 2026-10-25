import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generado/prisma/client';
import type { Miembro } from '../dominio/entidades';
import type { MiembroRepository } from '../dominio/miembro.repository';
import type { CrearMiembroDto } from '../dto/crear-miembro.dto';
import type { ActualizarMiembroDto } from '../dto/actualizar-miembro.dto';

@Injectable()
export class MiembroPrismaRepository implements MiembroRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Miembro[]> {
    return this.prisma.miembro.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async buscarPorId(id: number): Promise<Miembro | null> {
    return this.prisma.miembro.findUnique({
      where: { id },
    });
  }

  async crear(datos: CrearMiembroDto): Promise<Miembro> {
    return this.prisma.miembro.create({
      data: {
        nombre: datos.nombre,
        correo: datos.correo,
        membresia: datos.membresia,
      },
    });
  }

  async actualizar(
    id: number,
    datos: ActualizarMiembroDto,
  ): Promise<Miembro | null> {
    try {
      return await this.prisma.miembro.update({
        where: { id },
        data: {
          nombre: datos.nombre,
          correo: datos.correo,
          membresia: datos.membresia,
          activo: datos.activo,
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

  async eliminar(id: number): Promise<Miembro | null> {
    try {
      return await this.prisma.miembro.delete({
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