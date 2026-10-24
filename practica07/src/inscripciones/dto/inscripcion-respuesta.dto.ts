import { Inscripcion } from '../dominio/entidades';

export interface InscripcionResponseDto {
  id: number;
  horarioId: number;
  miembroId: number;
  estado: string;
  creadaEn: string;
}

// Todo lo que sale de la API pasa por aqui: convierte el Date a texto
// ISO. JSON no tiene un tipo fecha.
export function aInscripcionDto(i: Inscripcion): InscripcionResponseDto {
  return {
    id: i.id,
    horarioId: i.horarioId,
    miembroId: i.miembroId,
    estado: i.estado,
    creadaEn: i.creadaEn.toISOString(),
  };
}
