import { Horario, Inscripcion, InscripcionDetallada, Miembro, NuevaInscripcion } from './entidades';

// Lo que el Service conoce. No sabe que detras esta MySQL.
export interface InscripcionRepository {
  listar(): Promise<Inscripcion[]>;
  buscarPorId(id: number): Promise<Inscripcion | null>;
  // Las confirmadas de un miembro, con su clase y horario.
  listarDeMiembro(miembroId: number): Promise<InscripcionDetallada[]>;
  buscarPorHorario(horarioId: number): Promise<Inscripcion[]>;
  buscarHorario(horarioId: number): Promise<Horario | null>;
  buscarMiembro(miembroId: number): Promise<Miembro | null>;
  guardar(datos: NuevaInscripcion): Promise<Inscripcion>;
  cancelar(id: number): Promise<Inscripcion | null>;
}
