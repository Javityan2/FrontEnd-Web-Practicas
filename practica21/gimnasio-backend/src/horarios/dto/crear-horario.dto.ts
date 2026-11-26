import { IsInt, IsNotEmpty, IsString, Matches, Min } from 'class-validator';

export class CrearHorarioDto {
  @IsInt()
  claseId: number;

  @IsString()
  @IsNotEmpty()
  dia: string;

  // HH:MM de 24 horas.
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  horaInicio: string;

  @IsInt()
  @Min(1)
  cupoMaximo: number;

  @IsString()
  @IsNotEmpty()
  entrenador: string;
}
