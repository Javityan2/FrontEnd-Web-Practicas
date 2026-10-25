import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generado/prisma/client';
import type { ClaseRepository } from '../dominio/clase.repository';
import type { CrearClaseDto } from '../dto/crear-clase.dto';
import type { ActualizarClaseDto } from '../dto/actualizar-clase.dto';

@Injectable()
export class ClasePrismaRepository implements ClaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.clase.findMany({ orderBy: { id: 'asc' } });
  }
  buscarPorId(id: number) {
    return this.prisma.clase.findUnique({ where: { id } });
  }
  crear(datos: CrearClaseDto) {
    return this.prisma.clase.create({ data: { nombre: datos.nombre } });
  }
  async actualizar(id: number, datos: ActualizarClaseDto) {
    try {
      return await this.prisma.clase.update({
        where: { id }, data: { nombre: datos.nombre },
      });
    } catch (error) {
      return this.manejarError(error);
    }
  }
  async eliminar(id: number) {
    try {
      return await this.prisma.clase.delete({ where: { id } });
    } catch (error) {
      return this.manejarError(error);
    }
  }
  private manejarError(error: unknown): null {
    if (error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025') return null;
    throw error;
  }
}