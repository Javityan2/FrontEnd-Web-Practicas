export abstract class ErrorDominio extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = new.target.name;
  }
}

export class HorarioNoEncontradoError extends ErrorDominio {
  constructor(horarioId: number) {
    super(`No existe el horario ${horarioId}`);
  }
}

export class MiembroNoEncontradoError extends ErrorDominio {
  constructor(miembroId: number) {
    super(`No existe el miembro ${miembroId}`);
  }
}

export class CupoLlenoError extends ErrorDominio {
  constructor(horarioId: number, cupoMaximo: number) {
    super(
      `El horario ${horarioId} ya tiene ${cupoMaximo} inscripciones confirmadas`,
    );
  }
}

export class InscripcionDuplicadaError extends ErrorDominio {
  constructor(horarioId: number, miembroId: number) {
    super(
      `El miembro ${miembroId} ya esta inscrito en el horario ${horarioId}`,
    );
  }
}
