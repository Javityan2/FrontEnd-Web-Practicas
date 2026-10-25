// Datos de un producto del catálogo.
export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  existencia: number;
}

// Datos que comunica la tarjeta al agregar un producto.
export interface DetalleAgregar {
  id: string;
  nombre: string;
  precio: number;
}

// Tipado del evento personalizado para los listeners del catálogo.
declare global {
  interface HTMLElementEventMap {
    agregar: CustomEvent<DetalleAgregar>;
  }
}
