import { Horario } from './entidades';
import { CrearHorarioDto } from '../dto/crear-horario.dto';
import { ActualizarHorarioDto } from '../dto/actualizar-horario.dto';

// Lo que el Service conoce. No sabe que detras esta MySQL.
export interface HorarioRepository {
  listar(): Promise<Horario[]>;
  buscarPorId(id: number): Promise<Horario | null>;
  crear(datos: CrearHorarioDto): Promise<Horario>;
  actualizar(id: number, datos: ActualizarHorarioDto): Promise<Horario | null>;
  eliminar(id: number): Promise<Horario | null>;
}
