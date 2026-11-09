import { useCallback, useEffect, useState } from 'react';
import { traerClase } from '../servicios/gimnasio';
import { mensajeDeError } from '../servicios/api';
import type { ClaseConHorarios } from '../tipos';

interface ResultadoClase {
  id: number;
  intento: number;
  clase: ClaseConHorarios | null;
  error: string | null;
}

export function useClase(id: number) {
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState<ResultadoClase | null>(null);
  const idValido = Number.isSafeInteger(id) && id > 0;
  const reintentar = useCallback(() => setIntento(anterior => anterior + 1), []);

  useEffect(() => {
    if (!Number.isSafeInteger(id) || id <= 0) return;
    let vigente = true;

    traerClase(id)
      .then(clase => {
        if (vigente) setResultado({ id, intento, clase, error: null });
      })
      .catch(fallo => {
        if (vigente) setResultado({
          id, intento, clase: null,
          error: mensajeDeError(fallo, 'No se pudo cargar la clase.'),
        });
      });

    return () => { vigente = false; };
  }, [id, intento]);

  // Al cambiar la URL se muestra carga hasta tener el resultado de ese id.
  const actual = resultado?.id === id && resultado.intento === intento;
  return {
    clase: actual ? resultado.clase : null,
    cargando: idValido && !actual,
    error: !idValido ? 'El identificador de la clase debe ser un entero positivo.'
      : actual ? resultado.error : null,
    reintentar,
  };
}
