// Todo opcional: un PATCH manda solo lo que cambia. "activo" es el
// campo pensado para dar de baja a un miembro sin borrar su historial.
import {
  IsBoolean, IsEmail, IsString, Matches, MaxLength, ValidateIf,
} from 'class-validator';

export class ActualizarMiembroDto {
  @ValidateIf((_objeto, valor) => valor !== undefined)
  @IsString()
  @Matches(/\S/, { message: 'nombre no puede estar vacio' })
  @MaxLength(120)
  nombre?: string;

  @ValidateIf((_objeto, valor) => valor !== undefined)
  @IsEmail({}, { message: 'correo no tiene un formato valido' })
  @MaxLength(160)
  correo?: string;

  @ValidateIf((_objeto, valor) => valor !== undefined)
  @IsString()
  @Matches(/\S/, { message: 'membresia no puede estar vacia' })
  @MaxLength(20)
  membresia?: string;

  @ValidateIf((_objeto, valor) => valor !== undefined)
  @IsBoolean()
  activo?: boolean;
}