import type { Sesion } from '../tipos';

const CLAVE_SESION = 'gimnasio.sesion';

export function leerSesion(): Sesion | null {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION);
    if (!guardada) return null;

    const sesion = JSON.parse(guardada) as Partial<Sesion> | null;
    const usuario = sesion?.usuario;
    if (typeof sesion?.token !== 'string' || !sesion.token ||
        typeof usuario?.nombre !== 'string' || typeof usuario.correo !== 'string' ||
        !['miembro', 'entrenador', 'admin'].includes(usuario.rol)) {
      return null;
    }
    return { token: sesion.token, usuario };
  } catch {
    return null;
  }
}

export function guardarSesion(sesion: Sesion) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}
