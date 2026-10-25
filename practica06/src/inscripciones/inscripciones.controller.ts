import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Delete,
    Post,
    Res,
  } from '@nestjs/common';
  import type { Response } from 'express';
  import { InscripcionesService } from './inscripciones.service';
  import { aInscripcionDto } from './dto/inscripcion-respuesta.dto';
  import {
    HorarioNoEncontradoError,
    MiembroNoEncontradoError,
    InscripcionDuplicadaError,
    CupoLlenoError,
  } from './dominio/errores';
  
  @Controller('inscripciones')
  export class InscripcionesController {
    constructor(
      private readonly inscripcionesService: InscripcionesService,
    ) {}
  
    @Get()
    async listar() {
      const inscripciones = await this.inscripcionesService.listar();
      return inscripciones.map(aInscripcionDto);
    }
  
    @Get(':id')
  async buscar(@Param('id', ParseIntPipe) id: number) {
    if (id <= 0) {
      throw new BadRequestException('El id debe ser positivo');
    }

    const inscripcion = await this.inscripcionesService.buscar(id);

    if (!inscripcion) {
      throw new NotFoundException(`No existe la inscripción ${id}`);
    }

    return aInscripcionDto(inscripcion);
  }

  @Post()
    async crear(
      @Body() cuerpo: unknown,
      @Res({ passthrough: true }) respuesta: Response,
    ) {
      if (typeof cuerpo !== 'object' || cuerpo === null) {
        throw new BadRequestException('El cuerpo debe ser un objeto JSON');
      }
  
      const { horarioId, miembroId } = cuerpo as Record<string, unknown>;
  
      if (
        typeof horarioId !== 'number' ||
        !Number.isInteger(horarioId) ||
        horarioId <= 0 ||
        typeof miembroId !== 'number' ||
        !Number.isInteger(miembroId) ||
        miembroId <= 0
      ) {
        throw new BadRequestException(
          'horarioId y miembroId deben ser números enteros positivos',
        );
      }
  
      try {
        const inscripcion = await this.inscripcionesService.crear({
          horarioId,
          miembroId,
        });
  
        respuesta.location(`/inscripciones/${inscripcion.id}`);
        return aInscripcionDto(inscripcion);
      } catch (error: unknown) {
        if (
          error instanceof HorarioNoEncontradoError ||
          error instanceof MiembroNoEncontradoError
        ) {
          throw new NotFoundException(error.message);
        }
  
        if (
          error instanceof InscripcionDuplicadaError ||
          error instanceof CupoLlenoError
        ) {
          throw new ConflictException(error.message);
        }
  
        throw error;
      }
    }
  
    @Delete(':id')
    async cancelar(@Param('id', ParseIntPipe) id: number) {
      if (id <= 0) {
        throw new BadRequestException('El id debe ser positivo');
      }
  
      const inscripcion = await this.inscripcionesService.cancelar(id);
  
      if (!inscripcion) {
        throw new NotFoundException(`No existe la inscripción ${id}`);
      }
  
      return aInscripcionDto(inscripcion);
    }
  }