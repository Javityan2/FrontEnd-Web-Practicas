import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class ActualizarHorarioDto {
  @IsOptional()
  @IsInt()
  claseId?: number;

  @IsOptional()
  @IsString()
  dia?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  horaInicio?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  cupoMaximo?: number;

  @IsOptional()
  @IsString()
  entrenador?: string;
}
