import { Clase, ClaseConHorarios } from './entidades';
import { CrearClaseDto } from '../dto/crear-clase.dto';
import { ActualizarClaseDto } from '../dto/actualizar-clase.dto';

// Lo que el Service conoce. No sabe que detras esta MySQL.
export interface ClaseRepository {
  listar(): Promise<Clase[]>;
  buscarPorId(id: number): Promise<Clase | null>;
  // La clase con sus horarios y los lugares libres.
  buscarConHorarios(id: number): Promise<ClaseConHorarios | null>;
  crear(datos: CrearClaseDto): Promise<Clase>;
  actualizar(id: number, datos: ActualizarClaseDto): Promise<Clase | null>;
  eliminar(id: number): Promise<Clase | null>;
}
