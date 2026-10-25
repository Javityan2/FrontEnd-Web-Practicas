import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Rol } from '../dominio/usuario';
import type { NuevoUsuario, Usuario } from '../dominio/usuario';
import type { UsuarioRepository } from '../dominio/usuario.repository';

@Injectable()
export class UsuarioPrismaRepository implements UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        correo: correo.trim().toLowerCase(),
      },
    });

    if (!usuario) {
      return null;
    }

    return {
      ...usuario,
      rol: usuario.rol as Rol,
    };
  }

  async guardar(nuevo: NuevoUsuario): Promise<Usuario> {
    const usuario = await this.prisma.usuario.create({
      data: {
        ...nuevo,
        correo: nuevo.correo.trim().toLowerCase(),
      },
    });

    return {
      ...usuario,
      rol: usuario.rol as Rol,
    };
  }
}