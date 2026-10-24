import type { Prestamo, EstadoPrestamo } from '../dominio/prestamo.entity.js';

//LO QUE EL CLIENTE RECIBE
export interface PrestamoResponseDto {
  folio: string;
  libroId: string;
  ejemplares: number[];
  socioId: string;
  estado: EstadoPrestamo;
  creadoEn: string; 
}

//LO QUE EL CLIENTE MANDA
export interface CrearPrestamoRequestDto {
  libroId: string;
  ejemplares: number[];
  socioId: string;
}

//LA FORMA DE LOS ERRORES QUE TAMBI[EN ES PARTE DEL CONTRATO
export interface ErrorResponseDto {
  error: string;
  mensaje: string;
  detalles?: string[];
}

//MAPPER entidad a DTO
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
