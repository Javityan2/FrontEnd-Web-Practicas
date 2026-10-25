import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CrearInscripcionDto {
  @ApiProperty({
    description: 'Identificador del horario',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  horarioId!: number;

  @ApiProperty({
    description: 'Identificador del miembro que se inscribe',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  miembroId!: number;
}