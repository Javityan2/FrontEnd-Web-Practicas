import { api, type Sobre } from './api';
import type { Producto } from '../datos';

export async function obtenerProductos(): Promise<Producto[]> {
  const respuesta = await api.get<Sobre<Producto[]>>('/productos');
  return respuesta.data.data;
}
