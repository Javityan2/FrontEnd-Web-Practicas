// UNA instancia de Axios para toda la app. Nadie más importa axios.
import axios from 'axios';
import { borrarSesion, EVENTO_SESION_TERMINADA, leerSesion } from '../sesion/almacenamiento';

// Donde corre gimnasio-backend. VITE_API_URL sólo se usa al desplegar (tutorial de la Semana 10).
export const URL_API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: URL_API,
  timeout: 5000, // si en 5 s no responde, es error
});

api.interceptors.request.use(config => {
  const sesion = leerSesion();
  if (sesion && config.url !== '/auth/login' && config.url !== '/auth/registro') {
    config.headers.Authorization = `Bearer ${sesion.token}`;
  }
  return config;
});

api.interceptors.response.use(
  respuesta => respuesta,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 &&
        error.config?.url !== '/auth/login' && error.config?.url !== '/auth/registro') {
      const sesion = leerSesion();
      const autorizacion = axios.AxiosHeaders.from(error.config?.headers).get('Authorization');
      // Si el almacenamiento es ilegible, React aún puede tener la sesión en memoria.
      // Si ya hay una sesión distinta, se conserva aunque llegue un 401 anterior.
      if (!sesion || autorizacion === `Bearer ${sesion.token}`) {
        borrarSesion();
        window.dispatchEvent(new Event(EVENTO_SESION_TERMINADA));
      }
    }
    return Promise.reject(error);
  },
);

// El sobre de la Práctica 9B: toda respuesta exitosa llega como { data, meta }.
export interface Sobre<T> {
  data: T;
}

// Las imágenes las sirve la API: /img/clase-01.jpg → http://localhost:3000/img/clase-01.jpg
export function urlImagen(ruta: string): string {
  return `${URL_API}${ruta}`;
}

// El mensaje que se le enseña a la persona cuando algo falla.
export function mensajeDeError(e: unknown, generico: string): string {
  if (axios.isAxiosError(e)) {
    if (e.response?.status === 401 && e.config?.url !== '/auth/login') {
      return 'Tu sesión terminó. Vuelve a entrar.';
    }
    const mensaje = e.response?.data?.message; // 400 trae un arreglo; 404 y 409, un texto
    if (Array.isArray(mensaje)) return mensaje.join('. ');
    if (typeof mensaje === 'string') return mensaje;
  }
  return generico;
}
