import { IsIn, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

// Reglas de validacion. El ValidationPipe global las revisa
// antes de que el Controller vea el body.
export class CrearClaseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nombre: string;

  // Los campos que muestra el frontend.
  @IsIn(['fuerza', 'cardio', 'flexibilidad'])
  categoria: string;

  @IsString()
  @MaxLength(255)
  descripcion: string;

  @IsInt()
  @Min(10)
  duracionMin: number;

  @IsString()
  @MaxLength(120)
  imagen: string; // ruta relativa: /img/clase-09.jpg
}
