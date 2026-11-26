// ---------------------------------------------------------------------------
// servicios/errores.ts — CÓDIGO BASE (Práctica 21).
//
// Traduce un error HTTP a una frase que se le puede mostrar a una persona. Es
// la misma tabla que hicimos en React (Práctica 16), ahora con el
// HttpErrorResponse de Angular.
// ---------------------------------------------------------------------------

import { HttpErrorResponse } from '@angular/common/http';

export function mensajeDeApi(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'Algo falló y no fue la red. Revisa la consola.';
  }

  // status 0 = la petición nunca llegó: la API está apagada, o CORS la bloqueó.
  if (error.status === 0) {
    return 'No se pudo contactar la API. ¿Está corriendo en el puerto 3000?';
  }

  const delServidor = mensajesDelCuerpo(error.error).join('. ') || null;

  switch (error.status) {
    case 400:
      return delServidor ?? 'Los datos que mandaste no son válidos.';
    case 401:
      // Dos cosas responden 401: el login con «Credenciales inválidas» y el
      // guardia con el inútil «Unauthorized». Al usuario se le dicen cosas
      // diferentes.
      if (delServidor && delServidor !== 'Unauthorized') return delServidor;
      return 'Tu sesión no es válida o venció. Vuelve a entrar.';
    case 403:
      return 'Tu cuenta no tiene permiso para hacer esto.';
    case 404:
      return 'Eso ya no existe.';
    default:
      return error.status >= 500
        ? 'La API tuvo un problema. Inténtalo de nuevo.'
        : (delServidor ?? `Error ${error.status}.`);
  }
}

/**
 * Los mensajes que mandó el servidor, siempre como arreglo. El ValidationPipe
 * de Nest manda `message` como ARREGLO (uno por regla) y los demás errores
 * como texto. La Práctica 22 los pinta como lista.
 */
export function mensajesDelCuerpo(cuerpo: unknown): string[] {
  if (!cuerpo || typeof cuerpo !== 'object') return [];
  const m = (cuerpo as { message?: unknown }).message;
  if (typeof m === 'string') return [m];
  if (Array.isArray(m)) return m.map(String);
  return [];
}
