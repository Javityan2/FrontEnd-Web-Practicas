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

// Lo que hace falta para crear una: nada de id, estado ni creadaEn.
// Eso lo decide el dominio, no quien manda la peticion.
export type NuevaInscripcion = Omit<Inscripcion, 'id' | 'estado' | 'creadaEn'>;
