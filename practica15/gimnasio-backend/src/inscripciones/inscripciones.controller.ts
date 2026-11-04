import {
  Body,
  Controller,
  Delete,
  ForbiddenException, // el 403
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { InscripcionesService } from './inscripciones.service';
import { CrearInscripcionDto } from './dto/crear-inscripcion.dto';
import { aInscripcionDto } from './dto/inscripcion-respuesta.dto';
import { Roles } from '../auth/decoradores/roles.decorator';
import { UsuarioActual } from '../auth/decoradores/usuario-actual.decorator';
import { Rol, type PayloadJwt } from '../auth/dominio/usuario';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(private readonly servicio: InscripcionesService) {}

  // Todas las inscripciones: solo para el personal.
  // Un miembro ve las suyas en GET /inscripciones/mias.
  @Roles(Rol.entrenador, Rol.admin)
  @Get()
  async listar() {
    const lista = await this.servicio.listar();
    return lista.map(aInscripcionDto);
  }

  // Las inscripciones de quien viene en el token.
  // Va ANTES de ':id': si no, Nest leeria "mias" como si fuera un id.
  @Get('mias')
  mias(@UsuarioActual() usuario: PayloadJwt) {
    if (usuario.miembroId === null) {
      throw new ForbiddenException('Tu cuenta no es de un miembro del gimnasio');
    }
    return this.servicio.listarDeMiembro(usuario.miembroId);
  }

  @Get(':id')
  async buscar(@Param('id') id: string) {
    const inscripcion = await this.servicio.buscar(Number(id));
    if (!inscripcion) {
      throw new NotFoundException(`No existe la inscripcion ${id}`);
    }
    return aInscripcionDto(inscripcion);
  }

  // Los errores de dominio los traduce DominioExceptionFilter, y el
  // body ya llega validado por el ValidationPipe global.
  @Post()
  @HttpCode(201)
  async crear(
    @Body() dto: CrearInscripcionDto,
    @UsuarioActual() usuario: PayloadJwt, // quien viene en el token
    @Res({ passthrough: true }) res: Response,
  ) {
    // Si no mandan miembroId, se usa el del token.
    const miembroId = dto.miembroId ?? usuario.miembroId;
    if (miembroId === null) {
      throw new ForbiddenException('Tu cuenta no es de un miembro del gimnasio');
    }
    // Un miembro solo puede inscribirse a si mismo...
    if (usuario.rol === Rol.miembro && usuario.miembroId !== miembroId) {
      // ...si intenta inscribir a otro: 403 (se quien eres y no puedes).
      throw new ForbiddenException('Solo puedes inscribirte a ti mismo');
    }
    // El entrenador y el admin si pueden inscribir a cualquiera.
    const inscripcion = await this.servicio.crear({ horarioId: dto.horarioId, miembroId });
    res.setHeader('Location', `/inscripciones/${inscripcion.id}`);
    return aInscripcionDto(inscripcion);
  }

  // Solo el personal cancela. Sin token 401, miembro 403, entrenador 200.
  @Roles(Rol.entrenador, Rol.admin)
  @Delete(':id')
  async cancelar(@Param('id') id: string) {
    const cancelada = await this.servicio.cancelar(Number(id));
    if (!cancelada) {
      throw new NotFoundException(`No existe la inscripcion ${id}`);
    }
    return aInscripcionDto(cancelada);
  }
}
