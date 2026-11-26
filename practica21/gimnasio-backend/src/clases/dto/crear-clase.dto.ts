import { IsIn, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

// Reglas de validacion. El ValidationPipe global las revisa
// antes de que el Controller vea el body.
// Unidad IV: los mensajes van en espanol porque el formulario de Angular
// (Practica 22) los muestra tal cual al administrador.
export class CrearClaseDto {
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(80, { message: 'El nombre admite máximo 80 caracteres' })
  nombre: string;

  // Los campos que muestra el frontend.
  @IsIn(['fuerza', 'cardio', 'flexibilidad'], {
    message: 'La categoría debe ser fuerza, cardio o flexibilidad',
  })
  categoria: string;

  @IsString({ message: 'La descripción debe ser texto' })
  @MaxLength(255, { message: 'La descripción admite máximo 255 caracteres' })
  descripcion: string;

  @IsInt({ message: 'La duración debe ser un número entero' })
  @Min(10, { message: 'La duración mínima es de 10 minutos' })
  duracionMin: number;

  @IsString({ message: 'La imagen debe ser texto' })
  @MaxLength(120, { message: 'La ruta de la imagen admite máximo 120 caracteres' })
  imagen: string; // ruta relativa: /img/clase-09.jpg
}
