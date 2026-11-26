import { IsInt, IsOptional } from 'class-validator';

// El ValidationPipe global revisa estas reglas antes del Controller.
export class CrearInscripcionDto {
  @IsInt()
  horarioId: number;

  // Opcional. Si no viene, se usa el miembro del token.
  // El frontend del miembro solo manda { horarioId }.
  @IsOptional()
  @IsInt()
  miembroId?: number;
}
