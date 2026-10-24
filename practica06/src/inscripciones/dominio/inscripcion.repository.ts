import { Horario, Inscripcion, Miembro, NuevaInscripcion } from './entidades';

// La interfaz que el Service conoce. No sabe si detras hay un Map en
// memoria o MySQL: ese es el punto de la Sesion 7.
//
// Todos los metodos devuelven Promise aunque hoy el Map no lo necesite:
// el contrato se disena para el caso mas lento.
export interface InscripcionRepository {
  listar(): Promise<Inscripcion[]>;
  buscarPorId(id: number): Promise<Inscripcion | null>;
  buscarPorHorario(horarioId: number): Promise<Inscripcion[]>;
  buscarHorario(horarioId: number): Promise<Horario | null>;
  buscarMiembro(miembroId: number): Promise<Miembro | null>;
  guardar(datos: NuevaInscripcion): Promise<Inscripcion>;
  cancelar(id: number): Promise<Inscripcion | null>;
}
export const INSCRIPCION_REPOSITORY = Symbol('INSCRIPCION_REPOSITORY');