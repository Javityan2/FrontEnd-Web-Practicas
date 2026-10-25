import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CrearHorarioDto {
  @IsInt()
  @IsPositive()
  claseId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  dia!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'horaInicio debe tener formato HH:mm, entre 00:00 y 23:59',
  })
  horaInicio!: string;

  @IsInt()
  @IsPositive()
  cupoMaximo!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  entrenador!: string;
}