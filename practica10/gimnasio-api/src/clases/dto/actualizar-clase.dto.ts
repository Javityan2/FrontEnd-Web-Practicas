// Todo opcional: un PATCH manda solo lo que cambia.
import { IsString, Matches, MaxLength, ValidateIf } from 'class-validator';

export class ActualizarClaseDto {
  @ValidateIf((_objeto, valor) => valor !== undefined)
  @IsString()
  @Matches(/\S/, { message: 'nombre no puede estar vacio' })
  @MaxLength(80)
  nombre?: string;
}