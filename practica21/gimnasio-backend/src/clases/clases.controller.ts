import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../auth/decoradores/roles.decorator';
import { Rol } from '../auth/dominio/usuario';
import { Publico } from '../auth/decoradores/publico.decorator';
import { ClasesService } from './clases.service';
import { CrearClaseDto } from './dto/crear-clase.dto';
import { ActualizarClaseDto } from './dto/actualizar-clase.dto';

@Controller('clases')
export class ClasesController {
  constructor(private readonly clasesService: ClasesService) {}

  /** GET /clases y GET /clases?q=yoga (el buscador de la Unidad IV) */
  @Publico() // el catalogo lo ve cualquiera, sin cuenta
  @Get()
  listar(@Query('q') q?: string) {
    return this.clasesService.listar(q?.trim() || undefined);
  }

  /** GET /clases/2 */
  @Publico()
  @Get(':id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    // Regresa la clase con sus horarios y lugares libres.
    // ParseIntPipe: /clases/abc responde 400, no un 500 de Prisma.
    const clase = await this.clasesService.buscarConHorarios(id);
    if (!clase) {
      throw new NotFoundException(`No existe la clase ${id}`);
    }
    return clase;
  }

  // Las escrituras del catalogo son SOLO del administrador (el panel de Angular).
  // Sin token: 401. Con token de miembro o entrenador: 403.

  /** POST /clases */
  @Roles(Rol.admin)
  @Post()
  @HttpCode(201)
  crear(@Body() dto: CrearClaseDto) {
    return this.clasesService.crear(dto);
  }

  /** PATCH /clases/2 */
  @Roles(Rol.admin)
  @Patch(':id')
  async actualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarClaseDto) {
    const clase = await this.clasesService.actualizar(id, dto);
    if (!clase) {
      throw new NotFoundException(`No existe la clase ${id}`);
    }
    return clase;
  }

  /** DELETE /clases/2 (borra tambien sus horarios e inscripciones: onDelete Cascade) */
  @Roles(Rol.admin)
  @Delete(':id')
  async eliminar(@Param('id', ParseIntPipe) id: number) {
    const clase = await this.clasesService.eliminar(id);
    if (!clase) {
      throw new NotFoundException(`No existe la clase ${id}`);
    }
    return clase;
  }
}
