//  Este es lo que el sistema DEVUELVE. Fijense en lo que NO lleva:
//  `costoReposicion` se queda dentro. Ese es el punto del patron.
//
//  TODO:
//    1. Declarar PrestamoResponseDto con: folio, libroId, ejemplares,
//       socioId, estado y creadoEn como string (formato ISO).
//    2. Escribir la funcion `aResponseDto(p: Prestamo)` que convierte
//       la entidad en el DTO.


import type { Prestamo, EstadoPrestamo } from '../dominio/prestamo.entity.js';

export interface PrestamoResponseDto {
  folio: string;
  libroId: string;
  ejemplares: number[];
  socioId: string;
  estado: EstadoPrestamo;
  creadoEn: string; 
}

export function aResponseDto(p: Prestamo): PrestamoResponseDto {
  return {
    folio: p.folio,
    libroId: p.libroId,
    ejemplares: p.ejemplares,
    socioId: p.socioId,
    estado: p.estado,
    creadoEn: p.creadoEn.toISOString(),
  };
}
