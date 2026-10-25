// Validacion minima a mano. En la Sesion 9 (Blindar la API) la hace
// ValidationPipe.
import { IsInt, IsString, Matches, MaxLength, Min } from 'class-validator';

export class CrearHorarioDto {
  @IsInt()
  @Min(1)
  claseId!: number;

  @IsString()
  @Matches(/\S/)
  @MaxLength(20)
  dia!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'horaInicio debe tener formato HH:mm valido' })
  horaInicio!: string;

  @IsInt()
  @Min(1)
  cupoMaximo!: number;

  @IsString()
  @Matches(/\S/)
  @MaxLength(80)
  entrenador!: string;
}