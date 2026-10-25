import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generado/prisma/client';
import type { Clase } from '../dominio/entidades';
import type { ClaseRepository } from '../dominio/clase.repository';
import type { CrearClaseDto } from '../dto/crear-clase.dto';
import type { ActualizarClaseDto } from '../dto/actualizar-clase.dto';

@Injectable()
export class ClasePrismaRepository implements ClaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Clase[]> {
    return this.prisma.clase.findMany({
      select: { id: true, nombre: true },
      orderBy: { id: 'asc' },
    });
  }

  async buscarPorId(id: number): Promise<Clase | null> {
    return this.prisma.clase.findUnique({
      where: { id },
      select: { id: true, nombre: true },
    });
  }

  async crear(datos: CrearClaseDto): Promise<Clase> {
    return this.prisma.clase.create({
      data: { nombre: datos.nombre },
      select: { id: true, nombre: true },
    });
  }

  async actualizar(
    id: number,
    datos: ActualizarClaseDto,
  ): Promise<Clase | null> {
    try {
      return await this.prisma.clase.update({
        where: { id },
        data: { nombre: datos.nombre },
        select: { id: true, nombre: true },
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

  async eliminar(id: number): Promise<Clase | null> {
    try {
      return await this.prisma.clase.delete({
        where: { id },
        select: { id: true, nombre: true },
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