import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CrearMiembroDto } from './crear-miembro.dto';

export class ActualizarMiembroDto extends PartialType(CrearMiembroDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}