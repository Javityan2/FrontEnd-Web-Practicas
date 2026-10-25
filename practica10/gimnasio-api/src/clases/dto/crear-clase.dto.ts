// Validacion minima a mano. En la Sesion 9 (Blindar la API) la hace
// ValidationPipe.
import { IsString, Matches, MaxLength } from 'class-validator';

export class CrearClaseDto {
  @IsString()
  @Matches(/\S/, { message: 'nombre no puede estar vacio' })
  @MaxLength(80)
  nombre!: string;
}