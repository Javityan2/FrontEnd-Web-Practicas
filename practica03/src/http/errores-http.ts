export class ValidacionError extends Error {
  constructor(public readonly detalles: string[]) {
    super('La petición no cumple con el contrato');
    this.name = 'ValidacionError';
  }
}