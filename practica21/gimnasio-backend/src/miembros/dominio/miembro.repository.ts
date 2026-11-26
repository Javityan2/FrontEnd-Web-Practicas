import { Miembro } from './entidades';
import { CrearMiembroDto } from '../dto/crear-miembro.dto';
import { ActualizarMiembroDto } from '../dto/actualizar-miembro.dto';

// Lo que el Service conoce. No sabe que detras esta MySQL.
export interface MiembroRepository {
  listar(): Promise<Miembro[]>;
  buscarPorId(id: number): Promise<Miembro | null>;
  crear(datos: CrearMiembroDto): Promise<Miembro>;
  actualizar(id: number, datos: ActualizarMiembroDto): Promise<Miembro | null>;
  eliminar(id: number): Promise<Miembro | null>;
}
