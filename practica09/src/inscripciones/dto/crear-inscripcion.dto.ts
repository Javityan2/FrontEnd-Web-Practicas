import { IsInt, IsPositive } from 'class-validator';

export class CrearInscripcionDto {
  @IsInt({ message: 'horarioId debe ser un número entero' })
  @IsPositive({ message: 'horarioId debe ser positivo' })
  horarioId!: number;

  @IsInt({ message: 'miembroId debe ser un número entero' })
  @IsPositive({ message: 'miembroId debe ser positivo' })
  miembroId!: number;
}