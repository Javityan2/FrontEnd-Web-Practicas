// Todo opcional: un PATCH manda solo lo que cambia.
import { IsInt, IsString, Matches, MaxLength, Min, ValidateIf } from 'class-validator';

export class ActualizarHorarioDto {
  @ValidateIf((_objeto, valor) => valor !== undefined)
  @IsInt() @Min(1)
  claseId?: number;

  @ValidateIf((_objeto, valor) => valor !== undefined)
  @IsString() @Matches(/\S/) @MaxLength(20)
  dia?: string;

  @ValidateIf((_objeto, valor) => valor !== undefined)
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'horaInicio debe tener formato HH:mm valido' })
  horaInicio?: string;

  @ValidateIf((_objeto, valor) => valor !== undefined)
  @IsInt() @Min(1)
  cupoMaximo?: number;

  @ValidateIf((_objeto, valor) => valor !== undefined)
  @IsString() @Matches(/\S/) @MaxLength(80)
  entrenador?: string;
}