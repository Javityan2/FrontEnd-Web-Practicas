import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CrearMiembroDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre!: string;

  @IsEmail()
  @MaxLength(160)
  correo!: string;

  @IsString()
  @IsIn(['basica', 'plus', 'premium'])
  membresia!: string;
}