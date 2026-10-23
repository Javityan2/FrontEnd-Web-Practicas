/** Forma de un libro del catálogo. `id` es de sólo lectura; `anio` es opcional. */
export interface Libro {
  readonly id: string;
  titulo: string;
  autor: string;
  anio?: number;
  ejemplares: number;
}

/**
 * Estado del préstamo como unión de valores exactos (string literal union).
 * NO es un enum: el conjunto vive sólo en el sistema de tipos.
 *
 * Comprobación: `const e: EstadoPrestamo = 'ACTIVO'` no compila
 * (el literal en mayúsculas no pertenece a la unión).
 */
export type EstadoPrestamo = 'activo' | 'devuelto' | 'vencido';

export interface Prestamo {
  readonly folio: string;
  readonly libroId: string;
  readonly socio: string;
  readonly venceEn: Date;
  devueltoEn?: Date;
}

/** El libro pedido no está en el catálogo. */
export class LibroNoEncontradoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LibroNoEncontradoError';
  }
}

/** No quedan ejemplares libres para prestar. */
export class SinEjemplaresError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SinEjemplaresError';
  }
}
