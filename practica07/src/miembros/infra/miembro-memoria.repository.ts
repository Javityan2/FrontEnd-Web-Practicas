import { Injectable } from '@nestjs/common';
import type { Miembro } from '../dominio/entidades';
import type { MiembroRepository } from '../dominio/miembro.repository';
import type { CrearMiembroDto } from '../dto/crear-miembro.dto';
import type { ActualizarMiembroDto } from '../dto/actualizar-miembro.dto';

@Injectable()
export class MiembroMemoriaRepository implements MiembroRepository {
  private readonly miembros: Miembro[] = [
    {
      id: 1,
      nombre: 'Karla Duarte',
      correo: 'karla@itson.mx',
      membresia: 'premium',
      activo: true,
    },
    {
      id: 2,
      nombre: 'Omar Valdez',
      correo: 'omar@itson.mx',
      membresia: 'plus',
      activo: true,
    },
    {
      id: 3,
      nombre: 'Sofia Ibarra',
      correo: 'sofia@itson.mx',
      membresia: 'basica',
      activo: true,
    },
  ];

  private siguienteId = 4;

  async listar(): Promise<Miembro[]> {
    return [...this.miembros];
  }

  async buscarPorId(id: number): Promise<Miembro | null> {
    return this.miembros.find((miembro) => miembro.id === id) ?? null;
  }

  async crear(datos: CrearMiembroDto): Promise<Miembro> {
    const miembro: Miembro = {
      id: this.siguienteId++,
      nombre: datos.nombre,
      correo: datos.correo,
      membresia: datos.membresia,
      activo: true,
    };

    this.miembros.push(miembro);
    return miembro;
  }

  async actualizar(
    id: number,
    datos: ActualizarMiembroDto,
  ): Promise<Miembro | null> {
    const miembro = await this.buscarPorId(id);

    if (!miembro) {
      return null;
    }

    if (datos.nombre !== undefined) {
      miembro.nombre = datos.nombre;
    }

    if (datos.correo !== undefined) {
      miembro.correo = datos.correo;
    }

    if (datos.membresia !== undefined) {
      miembro.membresia = datos.membresia;
    }

    if (datos.activo !== undefined) {
      miembro.activo = datos.activo;
    }

    return miembro;
  }

  async eliminar(id: number): Promise<boolean> {
    const indice = this.miembros.findIndex(
      (miembro) => miembro.id === id,
    );

    if (indice === -1) {
      return false;
    }

    this.miembros.splice(indice, 1);
    return true;
  }
}
