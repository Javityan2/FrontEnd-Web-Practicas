import {
  type EstadoPrestamo,
  type Prestamo,
  type Libro,
  LibroNoEncontradoError,
  SinEjemplaresError,
} from './tipos.js';

export const DIAS_DE_PRESTAMO = 14;

export const MULTA_POR_DIA = 5;

const UN_DIA = 86_400_000; // milisegundos en un día

export interface Mostrador {
  libros: Libro[];
  prestamos: Prestamo[];
}

/** Cuántos ejemplares quedan libres (no prestados activos). */
export function disponiblesDe(m: Mostrador, libro: Libro): number {
  const prestados = m.prestamos.filter(
    (p) => p.libroId === libro.id && p.devueltoEn === undefined,
  ).length;

  return Math.max(0, libro.ejemplares - prestados);
}

/**
 * Registra un préstamo.
 * `hoy` entra como parámetro para poder probar con cualquier fecha.
 */
export function prestar(
  m: Mostrador,
  libroId: string,
  socio: string,
  hoy: Date,
): Prestamo {
  const libro = m.libros.find((l) => l.id === libroId);

  if (libro === undefined) {
    throw new LibroNoEncontradoError(
      `No se encontró el libro con id ${libroId}`,
    );
  }

  if (disponiblesDe(m, libro) === 0) {
    throw new SinEjemplaresError(
      `No hay ejemplares disponibles del libro ${libro.titulo}`,
    );
  }

  const prestamo: Prestamo = {
    folio: `P-${String(m.prestamos.length + 1).padStart(4, '0')}`,
    libroId,
    socio,
    venceEn: new Date(hoy.getTime() + DIAS_DE_PRESTAMO * UN_DIA),
  };

  m.prestamos.push(prestamo);
  return prestamo;
}

export function estadoDe(p: Prestamo, hoy: Date): EstadoPrestamo {
  if (p.devueltoEn !== undefined) return 'devuelto';
  return hoy > p.venceEn ? 'vencido' : 'activo';
}

/** Días de retraso respecto a la fecha de vencimiento. */
export function diasDeRetraso(p: Prestamo, hoy: Date): number {
  const referencia = p.devueltoEn ?? hoy;
  return Math.max(
    0,
    Math.ceil((referencia.getTime() - p.venceEn.getTime()) / UN_DIA),
  );
}

/**
 * Multa según el estado.
 * El `default` con `never` hace fallar la revisión de tipos si se agrega
 * un estado a la unión sin actualizar este switch.
 */
export function multaDe(
  p: Prestamo,
  estado: EstadoPrestamo,
  hoy: Date,
): number {
  const dias = diasDeRetraso(p, hoy);

  switch (estado) {
    case 'activo':
      return 0;
    case 'vencido':
    case 'devuelto':
      return dias * MULTA_POR_DIA;
    default: {
      const _exhaustiveCheck: never = estado;
      return _exhaustiveCheck;
    }
  }
}
