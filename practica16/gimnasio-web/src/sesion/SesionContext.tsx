import { useState, type ReactNode } from 'react';
import * as servicio from '../servicios/sesion';
import type { Sesion } from '../tipos';
import { borrarSesion, guardarSesion, leerSesion } from './almacenamiento';
import { SesionContext } from './useSesion';

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState(leerSesion);

  function iniciarSesion(nuevaSesion: Sesion) {
    guardarSesion(nuevaSesion);
    setSesion(nuevaSesion);
  }

  async function entrar(correo: string, password: string) {
    iniciarSesion(await servicio.entrar(correo, password));
  }

  async function registrar(nombre: string, correo: string, password: string) {
    iniciarSesion(await servicio.registrar(nombre, correo, password));
  }

  function salir() {
    borrarSesion();
    setSesion(null);
  }

  return (
    <SesionContext.Provider value={{ usuario: sesion?.usuario ?? null, entrar, registrar, salir }}>
      {children}
    </SesionContext.Provider>
  );
}
