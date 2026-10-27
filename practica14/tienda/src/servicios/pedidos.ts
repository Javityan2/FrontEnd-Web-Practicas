import { api, type Sobre } from './api';

export interface ContactoPago {
  correo: string;
  telefono: string;
}

export interface PedidoConfirmado {
  folio: string;
  total: number;
}

export async function crearPedido(contacto: ContactoPago, productos: string[]): Promise<PedidoConfirmado> {
  const respuesta = await api.post<Sobre<PedidoConfirmado>>('/pedidos', {
    ...contacto,
    productos,
  });
  return respuesta.data.data;
}
