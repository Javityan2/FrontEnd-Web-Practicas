import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 8000,
});

export interface Sobre<T> {
  data: T;
  meta: { timestamp: string; [clave: string]: unknown };
}

export function mensajeDeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const mensaje: unknown = error.response?.data?.message;
    if (typeof mensaje === 'string') return mensaje;
    if (Array.isArray(mensaje) && mensaje.every(item => typeof item === 'string')) {
      return mensaje.join('. ');
    }
    if (error.code === 'ECONNABORTED') return 'La API tardó demasiado en responder. Intenta nuevamente.';
    if (!error.response) return 'No se pudo conectar con la API. Comprueba que el servidor esté encendido.';
    return `La API respondió con un error (${error.response.status}).`;
  }
  return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}
