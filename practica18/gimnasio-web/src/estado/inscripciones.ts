import { create } from 'zustand';
import { leerSesion } from '../sesion/almacenamiento';
import { mensajeDeError } from '../servicios/api';
import { traerMisInscripciones } from '../servicios/gimnasio';
import type { Inscripcion } from '../tipos';

interface EstadoInscripciones {
  lista: Inscripcion[];
  cargando: boolean;
  error: string | null;
  cargar: () => Promise<void>;
  vaciar: () => void;
}

export const useInscripciones = create<EstadoInscripciones>()((set) => {
  let version = 0;

  return {
    lista: [],
    cargando: false,
    error: null,

    async cargar() {
      if (leerSesion()?.usuario.rol !== 'miembro') return;

      const consulta = ++version;
      set({ cargando: true, error: null });

      try {
        const lista = await traerMisInscripciones();
        if (consulta === version) set({ lista, cargando: false });
      } catch (fallo) {
        if (consulta === version) {
          set({ error: mensajeDeError(fallo, 'No se pudieron cargar tus inscripciones.'), cargando: false });
        }
      }
    },

    vaciar() {
      // Una respuesta en camino no puede volver a llenar el store tras salir.
      version++;
      set({ lista: [], cargando: false, error: null });
    },
  };
});
