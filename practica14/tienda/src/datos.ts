// Contrato de productos y formato de moneda compartidos por los componentes.

// La forma de un producto. Es el contrato de datos de toda la tienda.
export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  existencia: number;
}

// Formato de dinero: 1299 → "$1,299.00". Se crea una vez y se reusa.
export const pesos = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

