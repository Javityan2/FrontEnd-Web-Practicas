import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CrearClaseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nombre!: string;
}