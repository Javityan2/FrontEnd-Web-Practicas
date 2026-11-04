export interface Clase {
  id: number;
  nombre: string;
  duracionMin: number;
}

export interface Horario {
  id: number;
  claseId: number;
  dia: string;
  horaInicio: string;
  cupoMaximo: number;
  entrenador: string;
}

export interface Miembro {
  id: number;
  nombre: string;
  correo: string;
  membresia: string;
  activo: boolean;
}

export type EstadoInscripcion = 'confirmada' | 'cancelada';

export interface Inscripcion {
  id: number;
  horarioId: number;
  miembroId: number;
  estado: EstadoInscripcion;
  creadaEn: Date;
}

// Lo que regresa GET /inscripciones/mias.
export interface InscripcionDetallada {
  id: number;
  estado: EstadoInscripcion;
  creadaEn: Date;
  horario: { id: number; dia: string; horaInicio: string; entrenador: string };
  clase: { id: number; nombre: string; imagen: string };
}

export type NuevaInscripcion = Omit<Inscripcion, 'id' | 'estado' | 'creadaEn'>;
