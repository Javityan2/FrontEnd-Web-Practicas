import type { Miembro } from './entidades';
import type { CrearMiembroDto } from '../dto/crear-miembro.dto';
import type { ActualizarMiembroDto } from '../dto/actualizar-miembro.dto';

export interface MiembroRepository {
  listar(): Promise<Miembro[]>;

  buscarPorId(id: number): Promise<Miembro | null>;

  crear(datos: CrearMiembroDto): Promise<Miembro>;

  actualizar(
    id: number,
    datos: ActualizarMiembroDto,
  ): Promise<Miembro | null>;

  eliminar(id: number): Promise<boolean>;
}