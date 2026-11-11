import { useEffect, useState, type ReactNode } from 'react';
import { useInscripciones } from '../estado/inscripciones';
import * as servicio from '../servicios/sesion';
import type { Sesion } from '../tipos';
import { borrarSesion, EVENTO_SESION_TERMINADA, guardarSesion, leerSesion } from './almacenamiento';
import { SesionContext } from './useSesion';

export function ProveedorSesion({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState(leerSesion);

  useEffect(() => {
    function terminarSesion() {
      useInscripciones.getState().vaciar();
      setSesion(null);
    }

    window.addEventListener(EVENTO_SESION_TERMINADA, terminarSesion);
    return () => window.removeEventListener(EVENTO_SESION_TERMINADA, terminarSesion);
  }, []);

  useEffect(() => {
    if (sesion?.usuario.rol === 'miembro') {
      void useInscripciones.getState().cargar();
    }
  }, [sesion]);

  function iniciarSesion(nuevaSesion: Sesion) {
    guardarSesion(nuevaSesion);
    useInscripciones.getState().vaciar();
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
    useInscripciones.getState().vaciar();
    setSesion(null);
  }

  return (
    <SesionContext.Provider value={{ usuario: sesion?.usuario ?? null, entrar, registrar, salir }}>
      {children}
    </SesionContext.Provider>
  );
}
