export interface Clase {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  duracionMin: number;
  imagen: string;
}

// Lo que regresa GET /clases/:id: la clase con sus horarios
// y los lugares libres de cada uno.
export interface HorarioConLugares {
  id: number;
  dia: string;
  horaInicio: string;
  entrenador: string;
  cupoMaximo: number;
  disponibles: number;
}

export interface ClaseConHorarios extends Clase {
  horarios: HorarioConLugares[];
}
