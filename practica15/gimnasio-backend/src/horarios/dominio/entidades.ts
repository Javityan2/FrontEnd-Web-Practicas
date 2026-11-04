// Aqui cupoMaximo es solo un dato. La regla de no pasarse
// del cupo (CupoLlenoError) vive en Inscripciones.
export interface Horario {
  id: number;
  claseId: number;
  dia: string;
  horaInicio: string;
  cupoMaximo: number;
  entrenador: string;
}
