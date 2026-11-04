// El repositorio de usuarios contra MySQL.
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NuevoUsuario, Rol, Usuario } from '../dominio/usuario';
import { UsuarioRepository } from '../dominio/usuario.repository';

@Injectable()
export class UsuarioPrismaRepository implements UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {} // PrismaModule es @Global()

  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    const fila = await this.prisma.usuario.findUnique({
      // findUnique porque correo es @unique en el esquema
      where: { correo: correo.toLowerCase() },
    });
    // En la base rol es texto; en el dominio es el enum Rol.
    return fila ? { ...fila, rol: fila.rol as Rol } : null;
  }

  async guardar(nuevo: NuevoUsuario): Promise<Usuario> {
    // id y creadoEn no se mandan: los pone MySQL.
    const fila = await this.prisma.usuario.create({
      data: { ...nuevo, correo: nuevo.correo.toLowerCase() },
    });
    return { ...fila, rol: fila.rol as Rol };
  }

  // Crea miembro + usuario, o ninguno de los dos.
  async registrarMiembro(nuevo: Omit<NuevoUsuario, 'rol' | 'miembroId'>): Promise<Usuario> {
    const correo = nuevo.correo.toLowerCase();
    const fila = await this.prisma.$transaction(async (tx) => {
      // upsert: si el gimnasio ya tenia a esa persona como miembro (Sofia, en el
      // seed), se le liga la cuenta; si no, se crea con membresia basica.
      const miembro = await tx.miembro.upsert({
        where: { correo },
        update: {},
        create: { nombre: nuevo.nombre, correo, membresia: 'basica', activo: true },
      });
      return tx.usuario.create({
        data: { ...nuevo, correo, rol: Rol.miembro, miembroId: miembro.id },
      });
    });
    return { ...fila, rol: fila.rol as Rol };
  }
}
