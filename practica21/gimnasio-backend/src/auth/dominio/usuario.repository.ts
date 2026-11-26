// Interfaz + token, como en los demas modulos.
import { NuevoUsuario, Usuario } from './usuario';

// Lo que el AuthService necesita. No sabe si es memoria o MySQL.
export interface UsuarioRepository {
  buscarPorCorreo(correo: string): Promise<Usuario | null>;
  guardar(nuevo: NuevoUsuario): Promise<Usuario>;
  // Crea al miembro y a su usuario en una sola transaccion.
  registrarMiembro(nuevo: Omit<NuevoUsuario, 'rol' | 'miembroId'>): Promise<Usuario>;
}

// La interfaz se borra al compilar, por eso se inyecta con este texto.
export const USUARIO_REPOSITORY = 'USUARIO_REPOSITORY';
