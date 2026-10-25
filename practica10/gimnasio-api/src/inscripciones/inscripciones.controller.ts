import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Res, ForbiddenException, UseGuards, ParseIntPipe } from '@nestjs/common';
import type { Response } from 'express';
import { InscripcionesService } from './inscripciones.service';
import { CrearInscripcionDto } from './dto/crear-inscripcion.dto';
import { aInscripcionDto } from './dto/inscripcion-respuesta.dto';
import { UsuarioActual } from '../auth/decoradores/usuario-actual.decorator';
import { Rol } from '../auth/dominio/usuario';
import type { PayloadJwt } from '../auth/dominio/usuario';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decoradores/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';


@ApiTags('Inscripciones')
@ApiBearerAuth()
@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly servicio: InscripcionesService) {}

  @Get()
  async listar() {
    const lista = await this.servicio.listar();
    return lista.map(aInscripcionDto);
  }

  @Get(':id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    const inscripcion = await this.servicio.buscar(id);
  
    if (!inscripcion) {
      throw new NotFoundException(`No existe la inscripcion ${id}`);
    }
  
    return aInscripcionDto(inscripcion);
  }

  @Post()
  @HttpCode(201)
  async crear(
    @Body() dto: CrearInscripcionDto,
    @UsuarioActual() usuario: PayloadJwt,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (usuario.rol === Rol.miembro &&
        usuario.miembroId !== dto.miembroId) {
      throw new ForbiddenException('Solo puedes inscribirte a ti mismo');
  }

    const inscripcion = await this.servicio.crear(dto);
    res.setHeader('Location', `/inscripciones/${inscripcion.id}`);
    return aInscripcionDto(inscripcion);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Rol.entrenador, Rol.admin)
  async cancelar(@Param('id', ParseIntPipe) id: number) {
    const cancelada = await this.servicio.cancelar(id);
  
    if (!cancelada) {
      throw new NotFoundException(`No existe la inscripcion ${id}`);
    }
  
    return aInscripcionDto(cancelada);
  }
}
