import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '../../generado/prisma/client';
import type { MiembroRepository } from '../dominio/miembro.repository';
import type { CrearMiembroDto } from '../dto/crear-miembro.dto';
import type { ActualizarMiembroDto } from '../dto/actualizar-miembro.dto';

@Injectable()
export class MiembroPrismaRepository implements MiembroRepository {
  constructor(private readonly prisma: PrismaService) {}

  listar() {
    return this.prisma.miembro.findMany({ orderBy: { id: 'asc' } });
  }
  buscarPorId(id: number) {
    return this.prisma.miembro.findUnique({ where: { id } });
  }
  async crear(datos: CrearMiembroDto) {
    try {
      return await this.prisma.miembro.create({
        data: { nombre: datos.nombre, correo: datos.correo,
          membresia: datos.membresia },
      });
    } catch (error) {
      this.verificarCorreoDuplicado(error);
      throw error;
    }
  }
  async actualizar(id: number, datos: ActualizarMiembroDto) {
    try {
      return await this.prisma.miembro.update({
        where: { id },
        data: { nombre: datos.nombre, correo: datos.correo,
          membresia: datos.membresia, activo: datos.activo },
      });
    } catch (error) {
      return this.manejarError(error);
    }
  }
  async eliminar(id: number) {
    try {
      return await this.prisma.miembro.delete({ where: { id } });
    } catch (error) {
      return this.manejarError(error);
    }
  }
  private verificarCorreoDuplicado(error: unknown): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002') {
      throw new ConflictException('Ese correo ya pertenece a un miembro');
    }
  }
  private manejarError(error: unknown): null {
    this.verificarCorreoDuplicado(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025') return null;
    throw error;
  }
}