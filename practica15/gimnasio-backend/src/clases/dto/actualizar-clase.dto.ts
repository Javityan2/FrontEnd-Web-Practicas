import { PartialType } from '@nestjs/swagger';
import { CrearClaseDto } from './crear-clase.dto';

// Todo lo de crear, pero opcional. PartialType copia tambien los decoradores.
export class ActualizarClaseDto extends PartialType(CrearClaseDto) {}
