// Validacion minima a mano. En la Sesion 9 (Blindar la API) la hace
// ValidationPipe.
import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';

export class CrearMiembroDto {
  @IsString()
  @Matches(/\S/, { message: 'nombre no puede estar vacio' })
  @MaxLength(120)
  nombre!: string;

  @IsEmail({}, { message: 'correo no tiene un formato valido' })
  @MaxLength(160)
  correo!: string;

  @IsString()
  @Matches(/\S/, { message: 'membresia no puede estar vacia' })
  @MaxLength(20)
  membresia!: string;
}