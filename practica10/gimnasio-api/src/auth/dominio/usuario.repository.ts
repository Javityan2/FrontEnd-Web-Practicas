import type { NuevoUsuario, Usuario } from './usuario';

export interface UsuarioRepository {
  buscarPorCorreo(correo: string): Promise<Usuario | null>;
  guardar(nuevo: NuevoUsuario): Promise<Usuario>;
}

export const USUARIO_REPOSITORY = 'USUARIO_REPOSITORY';