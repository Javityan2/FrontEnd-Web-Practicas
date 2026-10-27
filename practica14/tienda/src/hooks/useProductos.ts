import { useCallback, useEffect, useState } from 'react';
import type { Producto } from '../datos';
import { obtenerProductos } from '../servicios/productos';
import { mensajeDeError } from '../servicios/api';

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const recargar = useCallback(() => {
    setCargando(true);
    setError(null);
    setVersion(anterior => anterior + 1);
  }, []);

  useEffect(() => {
    let activo = true;
    obtenerProductos()
      .then(lista => { if (activo) setProductos(lista); })
      .catch(fallo => { if (activo) setError(mensajeDeError(fallo)); })
      .finally(() => { if (activo) setCargando(false); });

    // Una respuesta anterior no debe reemplazar el resultado de un efecto nuevo.
    return () => { activo = false; };
  }, [version]);

  return { productos, cargando, error, recargar };
}



