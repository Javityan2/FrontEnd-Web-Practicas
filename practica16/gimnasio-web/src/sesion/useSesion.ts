import { createContext, useContext } from 'react';
import type { Usuario } from '../tipos';

interface ValorSesion {
  usuario: Usuario | null;
  entrar: (correo: string, password: string) => Promise<void>;
  registrar: (nombre: string, correo: string, password: string) => Promise<void>;
  salir: () => void;
}

export const SesionContext = createContext<ValorSesion | null>(null);

export function useSesion() {
  const sesion = useContext(SesionContext);
  if (sesion === null) {
    throw new Error('useSesion debe usarse dentro de ProveedorSesion.');
  }
  return sesion;
}
