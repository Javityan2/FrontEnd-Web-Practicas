import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Patch,
    Delete,
    HttpCode,
  } from '@nestjs/common';
  import { MiembrosService } from './miembros.service';
  import type { ActualizarMiembroDto } from './dto/actualizar-miembro.dto';
  
  @Controller('miembros')
  export class MiembrosController {
    constructor(
      private readonly miembrosService: MiembrosService,
    ) {}
  
    @Get()
    listar() {
      return this.miembrosService.listar();
    }
  
    @Get(':id')
    async buscar(@Param('id', ParseIntPipe) id: number) {
      if (id <= 0) {
        throw new BadRequestException('El id debe ser positivo');
      }
  
      const miembro = await this.miembrosService.buscar(id);
  
      if (!miembro) {
        throw new NotFoundException(`No existe el miembro ${id}`);
      }
  
      return miembro;
    }

  @Post()
  crear(@Body() cuerpo: unknown) {
    if (
      typeof cuerpo !== 'object' ||
      cuerpo === null ||
      Array.isArray(cuerpo)
    ) {
      throw new BadRequestException('El cuerpo debe ser un objeto JSON');
    }

    const { nombre, correo, membresia } =
      cuerpo as Record<string, unknown>;

    if (
      typeof nombre !== 'string' ||
      nombre.trim() === '' ||
      typeof correo !== 'string' ||
      correo.trim() === '' ||
      typeof membresia !== 'string' ||
      membresia.trim() === ''
    ) {
      throw new BadRequestException(
        'nombre, correo y membresia deben ser textos no vacíos',
      );
    }

    return this.miembrosService.crear({
      nombre: nombre.trim(),
      correo: correo.trim(),
      membresia: membresia.trim(),
    });
  }

  @Patch(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() cuerpo: unknown,
  ) {
    if (id <= 0) {
      throw new BadRequestException('El id debe ser positivo');
    }

    if (
      typeof cuerpo !== 'object' ||
      cuerpo === null ||
      Array.isArray(cuerpo)
    ) {
      throw new BadRequestException('El cuerpo debe ser un objeto JSON');
    }

    const campos = cuerpo as Record<string, unknown>;
    const datos: ActualizarMiembroDto = {};

    for (const campo of ['nombre', 'correo', 'membresia'] as const) {
      if (campo in campos) {
        const valor = campos[campo];

        if (typeof valor !== 'string' || valor.trim() === '') {
          throw new BadRequestException(
            `${campo} debe ser un texto no vacío`,
          );
        }

        datos[campo] = valor.trim();
      }
    }

    if ('activo' in campos) {
      if (typeof campos.activo !== 'boolean') {
        throw new BadRequestException('activo debe ser booleano');
      }

      datos.activo = campos.activo;
    }

    if (Object.keys(datos).length === 0) {
      throw new BadRequestException(
        'Debes proporcionar al menos un campo actualizable',
      );
    }

    const miembro = await this.miembrosService.actualizar(id, datos);

    if (!miembro) {
      throw new NotFoundException(`No existe el miembro ${id}`);
    }

    return miembro;
  }
  
  @Delete(':id')
  @HttpCode(204)
  async eliminar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    if (id <= 0) {
      throw new BadRequestException('El id debe ser positivo');
    }
  
    const eliminado = await this.miembrosService.eliminar(id);
  
    if (!eliminado) {
      throw new NotFoundException(`No existe el miembro ${id}`);
    }
  }
}