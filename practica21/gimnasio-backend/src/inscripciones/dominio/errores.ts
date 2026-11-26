// La clase base de todos los errores del gimnasio.
// abstract: nadie lanza un "ErrorDeDominio" a secas, solo sus hijas.
// El filtro hace @Catch(ErrorDeDominio) y con eso atrapa a todas.
export abstract class ErrorDeDominio extends Error {}

export class HorarioNoEncontradoError extends ErrorDeDominio {
  constructor(horarioId: number) {
    super(`No existe el horario ${horarioId}`);
  }
}

export class MiembroNoEncontradoError extends ErrorDeDominio {
  constructor(miembroId: number) {
    super(`No existe el miembro ${miembroId}`);
  }
}

export class CupoLlenoError extends ErrorDeDominio {
  constructor(horarioId: number, cupoMaximo: number) {
    super(`Este horario ya está lleno (cupo de ${cupoMaximo})`);
    void horarioId;
  }
}

export class InscripcionDuplicadaError extends ErrorDeDominio {
  constructor(horarioId: number, miembroId: number) {
    super('Ya estás inscrito en este horario');
    void horarioId;
    void miembroId;
  }
}
